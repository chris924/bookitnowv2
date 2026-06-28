package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.auth.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.auth.PasswordChangeDTO;
import com.bookitnowv2.appointment_booking.exception.BadCredentialException;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.service.EmployeeAuthenticationService;
import com.bookitnowv2.appointment_booking.utils.CookieUtils;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/employee")
public class EmployeeAuthenticationController {

    private final EmployeeAuthenticationService employeeAuthenticationService;
    private final IEmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeAuthenticationController(EmployeeAuthenticationService employeeAuthenticationService, IEmployeeRepository employeeRepository, PasswordEncoder passwordEncoder)
    {
        this.employeeAuthenticationService = employeeAuthenticationService;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginEmployee(@Valid @RequestBody LoginDTO loginDTO, @NotNull BindingResult bindingResult, HttpServletResponse servletResponse)
    {
        if (bindingResult.hasErrors()) {
            throw new BadCredentialsException("Invalid employee login request body!");
        }

        try {
            String token = employeeAuthenticationService.loginEmployee(loginDTO.getEmail(), loginDTO.getPassword());

            ResponseCookie cookie = CookieUtils.createJwtCookie(token);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("Sikeres alkalmazott bejelentkezés");
        } catch (Exception e) {
            throw new BadCredentialException("Rossz felhasználónév vagy jelszó!");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeDTO body)
    {
        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeRepository.findById(employeeId).orElseThrow(() -> new EmployeeNotFoundException(employeeId.toString()));

        if (!passwordEncoder.matches(body.getOldPassword(), foundEmployee.getPassword())) {
            throw new BadCredentialException("A régi jelszó nem egyezik!");
        }

        foundEmployee.setPassword(passwordEncoder.encode(body.getNewPassword()));
        employeeRepository.save(foundEmployee);
        return ResponseEntity.ok("Jelszó sikeresen megváltoztatva!");
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<String> logoutEmployee(Authentication authentication, HttpServletRequest request, HttpServletResponse response)
    {
        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        new SecurityContextLogoutHandler().logout(request, response, authentication);

        ResponseCookie jwtCookie = CookieUtils.createExpiredJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");

    }

}
