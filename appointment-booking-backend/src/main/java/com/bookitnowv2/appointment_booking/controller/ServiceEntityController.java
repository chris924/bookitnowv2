package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.access.AccessDeniedException;


@RestController
@RequestMapping("/services")
public class ServiceEntityController {

    private final ServiceEntityService serviceEntityService;

    public ServiceEntityController(ServiceEntityService serviceEntityService)
    {
        this.serviceEntityService = serviceEntityService;
    }

    @DeleteMapping("/{serviceEntityId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> deleteServiceFromCompany(Long serviceEntityId)
    {
        ServiceEntity foundService = serviceEntityService.getServiceEntityById(serviceEntityId);

        Company currentCompany = SecurityUtils.getCurrentCompany();
        Company serviceOwnerCompany = foundService.getCompany();

        if(!currentCompany.getId().equals(serviceOwnerCompany.getId()))
        {
            throw new AccessDeniedException("Nincs jogod módosítani ezt a szolgáltatást!");
        }

        serviceEntityService.deleteService(foundService);
        return ResponseEntity.ok().body("A szolgáltatás sikeresen törölve!");
    }


}
