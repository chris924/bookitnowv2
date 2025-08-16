package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import org.springframework.http.ResponseEntity;
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

    public AppointmentController(ServiceEntityService serviceEntityService, AppointmentService appointmentService)
    {
        this.serviceEntityService = serviceEntityService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/employee/{serviceId}")
    public ResponseEntity<AppointmentSlotResponseDTO> getMonthlyAppointments(@PathVariable Integer serviceId)
    {
        ServiceEntity service = serviceEntityService.getServiceEntityById(serviceId);

        AppointmentSlotResponseDTO appointmentSlots = appointmentService.getAppointmentSlotsFromService(service);

        return ResponseEntity.ok(appointmentSlots);

    }

}
