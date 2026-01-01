package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.AppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import com.bookitnowv2.appointment_booking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final ServiceEntityService serviceEntityService;
    private final AppointmentService appointmentService;
    private final UserService userService;


    public AppointmentController(ServiceEntityService serviceEntityService, AppointmentService appointmentService, UserService userService) {
        this.serviceEntityService = serviceEntityService;
        this.appointmentService = appointmentService;
        this.userService = userService;
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


    @GetMapping("/user/booked-appointments")
    public ResponseEntity<List<AppointmentGetResponseDTO>> getUserBookedAppointments()
    {
        User foundUser = SecurityUtils.getCurrentUser();

        List<Appointment> appointments = foundUser.getAppointments();

        return ResponseEntity.ok(appointments.stream().map((AppointmentMapper::toGetDTO)).toList()) ;

    }

    @PostMapping("/user/cancel-appointment/{appointmentId}")
    public ResponseEntity<String> cancelUserAppointment(@PathVariable Long appointmentId) {
        User foundUser = SecurityUtils.getCurrentUser();

        Appointment foundAppointment = appointmentService.getAppointmentById(appointmentId);

        if (!foundAppointment.getUser().equals(foundUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nem a te foglalásod!");
        }

        appointmentService.cancelBookedAppointment(foundAppointment);

        return ResponseEntity.ok("A foglalás lemondva.");
    }


    @GetMapping("/company-total-month-data") //TODO: Replace into CompanyController, The service can stay in Appointment
    public List<AppointmentsByDateResponseDTO> getCompanyPastAppointmentsByMonth()
    {
        return appointmentService.getCompanyTotalAppointmentsByMonth(3);
    }


    @GetMapping("/employee-total-month-data") //TODO: Replace into CompanyController, The service can stay in Appointment ?
    public List<AppointmentsByDateResponseDTO> getEmployeePastAppointmentsByMonth()
    {
        return appointmentService.getEmployeeTotalAppointmentsByMonth(3);
    }




}
