package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanySectionCardsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;
    private final ICompanyRepository companyRepository;

    public CompanyController(CompanyService companyService, ICompanyRepository companyRepository)
    {
        this.companyService = companyService;
        this.companyRepository = companyRepository;
    }

    @GetMapping("/section-cards-statistics")
    public CompanySectionCardsResponseDTO getCompanySectionCardsStatistics()
    {
        return companyService.getCompanySectionCardsData();
    }

    @PutMapping("/change-company-details")
    @PreAuthorize("hasAnyRole('COMPANY')")
    public ResponseEntity<CompanyGetResponseDTO> changeCompanyDetails(@Valid @RequestBody CompanyUpdateDTO companyUpdateDTO)
    {

        CompanyGetResponseDTO responseDTO =  companyService.updateCompany(companyUpdateDTO);

        return ResponseEntity.ok(responseDTO);
    }



}
