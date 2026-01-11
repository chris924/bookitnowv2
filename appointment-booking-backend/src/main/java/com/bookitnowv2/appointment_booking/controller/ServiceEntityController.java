package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceEntityAddRequestDTO;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceEntityModifyRequestDTO;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceGetResponseDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.ServiceMapper;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.service.EmployeeService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.AccessDeniedException;

import java.util.List;


@RestController
@RequestMapping("/services")
public class ServiceEntityController {

    private final ServiceEntityService serviceEntityService;
    private final ICompanyRepository companyRepository;
    private final IEmployeeRepository employeeRepository;
    private final EmployeeService employeeService;
    private final ServiceMapper serviceMapper;

    public ServiceEntityController(ServiceEntityService serviceEntityService, ICompanyRepository companyRepository, IEmployeeRepository employeeRepository, ServiceMapper serviceMapper, EmployeeService employeeService)
    {
        this.serviceEntityService = serviceEntityService;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.employeeService = employeeService;
        this.serviceMapper = serviceMapper;
    }

    @DeleteMapping("/{employeeSlug}/delete/{serviceEntityId}")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceEntityId, @PathVariable String employeeSlug)
    {
        serviceEntityService.deleteServiceFromCompanyOrEmployee(serviceEntityId, employeeSlug);

        return ResponseEntity.ok().body("A szolgáltatás sikeresen törölve!");
    }

    @PutMapping("/{employeeSlug}/edit/{serviceEntityId}")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> editService(@PathVariable Long serviceEntityId, @PathVariable String employeeSlug, @Valid @RequestBody ServiceEntityModifyRequestDTO modifyRequestDTO)
    {

        serviceEntityService.modifyServiceEntityFromCompanyOrEmployee(serviceEntityId, employeeSlug, modifyRequestDTO);
        return ResponseEntity.ok().body("Adatok sikeresen módosítva.");
    }

    @PostMapping("/{employeeSlug}/create")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> addService(@PathVariable String employeeSlug, @Valid @RequestBody ServiceEntityAddRequestDTO addRequestDTO)
    {
        serviceEntityService.addServiceFromCompanyOrEmployee(employeeSlug, addRequestDTO);

        return ResponseEntity.ok("Szolgáltatás létrehozva.");

    }


    @GetMapping("/employee/services")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<List<ServiceGetResponseDTO>> getEmployeeServices()
    {
        Long employeeId = SecurityUtils.getCurrentEmployeeId();

        Employee foundEmployee = employeeRepository.findById(employeeId).orElseThrow(() -> new EmployeeNotFoundException(employeeId.toString()));

        List<ServiceEntity> services = foundEmployee.getServices();

        List<ServiceGetResponseDTO> dto = services.stream().map((ServiceMapper::toGetDTO)).toList();

        return ResponseEntity.ok(dto);
    }


}
