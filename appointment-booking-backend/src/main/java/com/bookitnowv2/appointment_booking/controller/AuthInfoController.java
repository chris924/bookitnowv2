package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.AuthInfoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

public class AuthInfoController {

    @GetMapping("/auth-info")
    public ResponseEntity<AuthInfoResponseDTO> checkAuth(Authentication authentication)
    {
        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        Object principal = authentication.getPrincipal();

        return switch (principal) {
            case User userPrincipal ->
                    ResponseEntity.ok(new AuthInfoResponseDTO(userPrincipal.getName(), userPrincipal.getEmail(), "USER"));
            case Company companyPrincipal ->
                    ResponseEntity.ok(new AuthInfoResponseDTO(companyPrincipal.getCompanyName(), companyPrincipal.getEmail(), "COMPANY"));
            case Employee employeePrincipal ->
                    ResponseEntity.ok(new AuthInfoResponseDTO(employeePrincipal.getName(), employeePrincipal.getEmail(), "EMPLOYEE"));
            case null, default -> ResponseEntity.notFound().build();
        };

    }

}
