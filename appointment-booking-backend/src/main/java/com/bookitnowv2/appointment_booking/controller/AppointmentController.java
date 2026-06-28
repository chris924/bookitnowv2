package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.AppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentTableDataResponseDTO;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import com.bookitnowv2.appointment_booking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final ServiceEntityService serviceEntityService;
    private final AppointmentService appointmentService;
    private final IUserRepository userRepository;
    private final IEmployeeRepository employeeRepository;
    private final UserService userService;


    public AppointmentController(ServiceEntityService serviceEntityService, IUserRepository userRepository, IEmployeeRepository employeeRepository, AppointmentService appointmentService, UserService userService) {
        this.serviceEntityService = serviceEntityService;
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/employee/{serviceId}")
    public ResponseEntity<AppointmentSlotResponseDTO> getEmployeeMonthlyAppointments(@PathVariable Long serviceId) {
        ServiceEntity service = serviceEntityService.getServiceEntityById(serviceId);

        AppointmentSlotResponseDTO appointmentSlots = appointmentService.getAppointmentSlotsFromService(service);

        return ResponseEntity.ok(appointmentSlots);

    }

    @GetMapping("/employee/book-event/{appointmentId}")
    public ResponseEntity<String> bookAppointment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long appointmentId)
    {
        String foundUsername = userDetails.getUsername();

        User foundUser = userService.getUserByUsername(foundUsername);
        Appointment foundAppointment = appointmentService.getAppointmentById(appointmentId);

        appointmentService.addUserToAppointment(foundAppointment, foundUser);

        return ResponseEntity.ok("User added to appointment.");
    }

    @GetMapping("/employee/detailed-appointment/{appointmentId}")
    public ResponseEntity<AppointmentGetResponseDTO> getEmployeeAppointmentDetails(@PathVariable Long appointmentId)
    {
        AppointmentGetResponseDTO responseDTO = appointmentService.employeeGetAppointmentDetailsById(appointmentId);

        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/user/booked-appointments")
    public ResponseEntity<List<AppointmentGetResponseDTO>> getUserBookedAppointments()
    {
        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));

        List<Appointment> appointments = foundUser.getAppointments();

        return ResponseEntity.ok(appointments.stream().map((AppointmentMapper::toGetDTO)).toList()) ;

    }

    @PostMapping("/user/cancel-appointment/{appointmentId}")
    public ResponseEntity<String> cancelUserAppointment(@PathVariable Long appointmentId) {

        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));

        Appointment foundAppointment = appointmentService.getAppointmentById(appointmentId);

        if (!foundAppointment.getUser().equals(foundUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nem a te foglalásod!");
        }

        appointmentService.cancelBookedAppointment(foundAppointment);

        return ResponseEntity.ok("A foglalás lemondva.");
    }


    @PostMapping("/employee/cancel-appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE')")
    public ResponseEntity<String> employeeCancelAppointment(@PathVariable Long appointmentId) {

        Long authEmployeeId = SecurityUtils.getCurrentEmployeeId();

        Employee foundEmployee = employeeRepository.findById(authEmployeeId).orElseThrow();


        Appointment foundAppointment = appointmentService.getAppointmentById(appointmentId);

        if (!foundAppointment.getService().getEmployee().equals(foundEmployee)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nem a te foglalásod!");
        }

        appointmentService.cancelBookedAppointment(foundAppointment);

        return ResponseEntity.ok("A foglalás lemondva.");
    }




    @GetMapping("/employee-appointments-table")
    public List<EmployeeAppointmentTableDataResponseDTO> getEmployeeAppointmentsTable()
    {
        return appointmentService.getEmployeeAppointmentsDataForTable();
    }




}
