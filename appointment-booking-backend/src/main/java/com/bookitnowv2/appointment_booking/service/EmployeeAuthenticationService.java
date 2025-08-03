package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class EmployeeAuthenticationService {


    private final EmployeeService employeeService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final EmployeeMapper employeeMapper;

    public EmployeeAuthenticationService(EmployeeService employeeService, RoleService roleService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenService tokenService,
                                         EmployeeMapper employeeMapper)
    {
        this.employeeService = employeeService;
        this.roleService =  roleService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.employeeMapper = employeeMapper;
    }


    public EmployeeGetResponseDTO registerEmployee(String name, String username, String email, String password)
    {

        String encodedPassword = passwordEncoder.encode(password);
        Role employeeRole = roleService.findByAuthority("EMPLOYEE");

        Set<Role> authorities = new HashSet<>();
        List<Appointment> appointments = new ArrayList<>();
        List<ServiceEntity> services = new ArrayList<>();

        authorities.add(employeeRole);
        Employee newEmployee = new Employee();
        newEmployee.setName(name);
        newEmployee.setUsername(username);
        newEmployee.setEmail(email);
        newEmployee.setPassword(encodedPassword);
        newEmployee.setAppointments(appointments);
        newEmployee.setAuthorities(authorities);
        newEmployee.setServices(services);

        Employee savedEmployee = employeeService.saveEmployee(newEmployee);
        return employeeMapper.toGetDTO(savedEmployee);
    }

    public String loginEmployee(String email, String password)
    {

        Employee employee = employeeService.getEmployeeByEmail(email);
        String employeeEmail = employee.getEmail();

        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(employeeEmail, password));

        return tokenService.generateJwt(auth, employee.getId());
    }

    public Integer getUserData(String jwt)
    {
        return Integer.valueOf(tokenService.decodeJwt(jwt).getSubject());
    }

}
