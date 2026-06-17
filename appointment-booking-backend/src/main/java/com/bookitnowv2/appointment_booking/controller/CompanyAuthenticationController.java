package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyLoginResponseDTO;
import com.bookitnowv2.appointment_booking.exception.BadCredentialException;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.service.CompanyAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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
    private final ICompanyRepository companyRepository;

    public CompanyAuthenticationController(CompanyAuthenticationService companyAuthenticationService, ICompanyRepository companyRepository)
    {
        this.companyAuthenticationService = companyAuthenticationService;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<CompanyLoginResponseDTO> loginCompany(@Valid @RequestBody LoginDTO body, @NotNull BindingResult bindingResult, HttpServletResponse servletResponse) {
        if (bindingResult.hasErrors()) {
            throw new BadCredentialsException("Invalid company login request body!");
        }
        CompanyLoginResponseDTO response = new CompanyLoginResponseDTO(body.getEmail());

        if (response.getEmail() == null) {
            throw new BadCredentialsException("Invalid company!");
        }

        try {
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
        } catch (Exception e) {
            throw new BadCredentialException("Rossz felhasználónév vagy jelszó!"); //TODO: Throw deeper, not here?
        }

    }


    @PostMapping("/logout")
    @Transactional //TODO: Add Redis blacklist JWT for more security?
    public ResponseEntity<String> logoutCompany(Authentication authentication, HttpServletRequest request, HttpServletResponse response)
    {
        Long authCompanyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(authCompanyId).orElseThrow(() -> new CompanyNotFoundException(authCompanyId.toString()));

        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        new SecurityContextLogoutHandler().logout(request, response, authentication);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)          // only send over HTTPS TODO: use true here
                .path("/")
                .maxAge(0)             // expire immediately
                .sameSite("Strict")    // prevents CSRF-like attacks
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");

    }

}
