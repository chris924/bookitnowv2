package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import com.bookitnowv2.appointment_booking.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<AppointmentSlotResponseDTO> getMonthlyAppointments(@PathVariable Integer serviceId) {
        ServiceEntity service = serviceEntityService.getServiceEntityById(serviceId);

        AppointmentSlotResponseDTO appointmentSlots = appointmentService.getAppointmentSlotsFromService(service);

        return ResponseEntity.ok(appointmentSlots);

    }

    @GetMapping("/employee/book-event/{appointmentId}")
    public ResponseEntity<?> bookAppointment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Integer appointmentId)
    {
        String foundUsername = userDetails.getUsername();

        User foundUser = userService.getUserByUsername(foundUsername);
        Appointment foundAppointment = appointmentService.getAppointmentById(appointmentId);

        appointmentService.addUserToAppointment(foundAppointment, foundUser);

        return ResponseEntity.ok("User added to appointment.");
    }







}
