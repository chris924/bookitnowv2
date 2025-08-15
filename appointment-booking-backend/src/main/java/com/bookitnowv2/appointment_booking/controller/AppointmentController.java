package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments/service-appointments/{serviceId}")
public class AppointmentController {

    private final ServiceEntityService serviceEntityService;

    public AppointmentController(ServiceEntityService serviceEntityService)
    {
        this.serviceEntityService = serviceEntityService;
    }

    //TODO: Finish appointment table
    @GetMapping("/employee/{serviceId}")
    public ResponseEntity<?> getMonthlyAppointments(@PathVariable Integer serviceId)
    {
        ServiceEntity service = serviceEntityService.getServiceEntityById(serviceId);
    }

}
