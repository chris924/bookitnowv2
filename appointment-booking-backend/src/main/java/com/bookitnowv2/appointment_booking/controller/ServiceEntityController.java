package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceEntityModifyRequestDTO;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> deleteServiceFromCompany(@PathVariable Long serviceEntityId)
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

    @PutMapping("/{serviceEntityId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> editServiceFromCompany(@PathVariable Long serviceEntityId, @Valid @RequestBody ServiceEntityModifyRequestDTO modifyRequestDTO)
    {
        ServiceEntity foundService = serviceEntityService.getServiceEntityById(serviceEntityId);

        Company currentCompany = SecurityUtils.getCurrentCompany();
        Company serviceOwnerCompany = foundService.getCompany();

        if(!currentCompany.getId().equals(serviceOwnerCompany.getId()))
        {
            throw new AccessDeniedException("Nincs jogod módosítani ezt a szolgáltatást!");
        }

        serviceEntityService.modifyServiceEntity(foundService, modifyRequestDTO);
        return ResponseEntity.ok().body("Adatok sikeresen módosítva.");
    }


}
