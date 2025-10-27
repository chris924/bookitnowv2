package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.dto.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanySectionCardsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.service.CompanyAuthenticationService;
import com.bookitnowv2.appointment_booking.service.CompanyService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService)
    {
        this.companyService = companyService;
    }

    @GetMapping("/appointments-month-data")
    public List<CompanyAppointmentsByDateResponseDTO> getMonthAppointmentsData()
    {
        return companyService.getTotalAppointmentsByMonth(3);
    }

    @GetMapping("/section-cards-statistics")
    public CompanySectionCardsResponseDTO getCompanyTotalRevenue()
    {
        return companyService.getCompanySectionCardsData();
    }



}
