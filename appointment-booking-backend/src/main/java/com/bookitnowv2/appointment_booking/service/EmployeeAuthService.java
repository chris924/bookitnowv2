package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeAuthService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final IEmployeeRepository employeeRepository;

    public EmployeeAuthService(PasswordEncoder passwordEncoder, IEmployeeRepository employeeRepository)
    {
        this.passwordEncoder = passwordEncoder;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("In the employee details service");
        System.out.println(email);

        return employeeRepository.getEmployeeByEmail(email).orElseThrow(() -> new UsernameNotFoundException("employee is not valid"));
    }
}
