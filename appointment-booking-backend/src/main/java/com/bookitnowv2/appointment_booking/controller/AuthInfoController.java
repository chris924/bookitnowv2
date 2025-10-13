package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.AuthInfoResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthInfoController {

    private UserMapper userMapper;
    private CompanyMapper companyMapper;
    private EmployeeMapper employeeMapper;
    private SecurityUtils securityUtils;

    @GetMapping("/auth-info")
    public ResponseEntity<?> checkAuth(Authentication authentication)
    {
        UserDetails userDetails = SecurityUtils.getCurrentPrincipal();

        return switch (userDetails) {
            case User userPrincipal ->
                    ResponseEntity.ok(UserMapper.toUserDataResponseDTO(userPrincipal));
            case Company companyPrincipal ->
                    ResponseEntity.ok(CompanyMapper.toGetDTO(companyPrincipal));
            case Employee employeePrincipal ->
                    ResponseEntity.ok(EmployeeMapper.toGetDTO(employeePrincipal));
            case null, default -> ResponseEntity.notFound().build();
        };

    }

}
