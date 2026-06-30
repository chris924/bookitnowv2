package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.auth.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.auth.PasswordChangeDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.exception.BadCredentialException;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.service.CompanyAuthenticationService;
import com.bookitnowv2.appointment_booking.utils.CookieUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
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

@RestController
@RequestMapping("/auth/company")
public class CompanyAuthenticationController {

    private final CompanyAuthenticationService companyAuthenticationService;
    private final ICompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final CookieUtils cookieUtils;

    public CompanyAuthenticationController(CompanyAuthenticationService companyAuthenticationService, ICompanyRepository companyRepository, PasswordEncoder passwordEncoder, CookieUtils cookieUtils)
    {
        this.companyAuthenticationService = companyAuthenticationService;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.cookieUtils = cookieUtils;
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

            ResponseCookie cookie = cookieUtils.createJwtCookie(token);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            throw new BadCredentialException("Rossz felhasználónév vagy jelszó!");
        }

    }


    @PostMapping("/register")
    public ResponseEntity<CompanyRegistrationResponseDTO> registerCompany(@Valid @RequestBody CompanyRegistrationDTO body, @NotNull BindingResult bindingResult)
    {
        if (bindingResult.hasErrors())
        {
            throw new BadCredentialsException("Invalid company register request body!");
        }

        CompanyRegistrationResponseDTO response = companyAuthenticationService.registerCompany(
                body.getName(), body.getPassword(), body.getEmail(),
                body.getAppServiceName(), body.getAppServiceDescription(), body.getDescription(), body.getPlace());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeDTO body)
    {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(companyId).orElseThrow(() -> new CompanyNotFoundException(companyId.toString()));

        if (!passwordEncoder.matches(body.getOldPassword(), foundCompany.getPassword())) {
            throw new BadCredentialException("A régi jelszó nem egyezik!");
        }

        foundCompany.setPassword(passwordEncoder.encode(body.getNewPassword()));
        companyRepository.save(foundCompany);
        return ResponseEntity.ok("Jelszó sikeresen megváltoztatva!");
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<String> logoutCompany(Authentication authentication, HttpServletRequest request, HttpServletResponse response)
    {
        Long authCompanyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(authCompanyId).orElseThrow(() -> new CompanyNotFoundException(authCompanyId.toString()));

        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        new SecurityContextLogoutHandler().logout(request, response, authentication);

        ResponseCookie jwtCookie = cookieUtils.createExpiredJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");

    }

}
