package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.service.EmailUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Per-principal {@link UserDetailsService} beans, backed by the shared
 * {@link EmailUserDetailsService}. Kept separate from {@code SecurityConfiguration}
 * because {@code JwtAuthFilter} depends on these beans, while
 * {@code SecurityConfiguration} depends on {@code JwtAuthFilter} — defining them
 * here avoids a bean dependency cycle.
 */
@Configuration
public class UserDetailsServiceConfig {

    @Bean("userAuthService")
    public UserDetailsService userAuthService(IUserRepository userRepository) {
        return new EmailUserDetailsService(userRepository::getUserByEmail, "user");
    }

    @Bean("companyAuthService")
    public UserDetailsService companyAuthService(ICompanyRepository companyRepository) {
        return new EmailUserDetailsService(companyRepository::getCompanyByEmail, "company");
    }

    @Bean("employeeAuthService")
    public UserDetailsService employeeAuthService(IEmployeeRepository employeeRepository) {
        return new EmailUserDetailsService(employeeRepository::getEmployeeByEmail, "employee");
    }
}
