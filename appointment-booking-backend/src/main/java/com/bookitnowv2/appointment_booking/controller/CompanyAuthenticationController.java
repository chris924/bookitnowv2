package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.dto.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyLoginResponseDTO;
import com.bookitnowv2.appointment_booking.service.CompanyAuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth/company")
public class CompanyAuthenticationController {

    private final CompanyAuthenticationService companyAuthenticationService;
    public CompanyAuthenticationController(CompanyAuthenticationService companyAuthenticationService)
    {
        this.companyAuthenticationService = companyAuthenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<CompanyLoginResponseDTO> loginUser(@Valid @RequestBody LoginDTO body, @NotNull BindingResult bindingResult, HttpServletResponse servletResponse) {
        if (bindingResult.hasErrors()) {
            throw new BadCredentialsException("Invalid user login request body!");
        }
        CompanyLoginResponseDTO response = new CompanyLoginResponseDTO(body.getEmail());

        if (response.getEmail() == null) {
            throw new BadCredentialsException("Invalid company!");
        }

        String token = companyAuthenticationService.loginCompany(body.getEmail(), body.getPassword());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                // ! ONLY FOR LOCALHOST TESTING !
                .secure(false) //TODO: Change in the future
                // ! ONLY FOR LOCALHOST TESTING !
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

}
