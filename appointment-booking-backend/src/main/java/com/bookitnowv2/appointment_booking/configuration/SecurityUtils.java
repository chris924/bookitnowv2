package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.service.CompanyAuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private static IUserRepository userRepository;
    private static ICompanyRepository companyRepository;
    private static CompanyAuthService companyAuthService;

    public SecurityUtils(IUserRepository userRepository, CompanyAuthService companyAuthService)
    {
        SecurityUtils.userRepository = userRepository;
        SecurityUtils.companyRepository = companyRepository;
        SecurityUtils.companyAuthService = companyAuthService;
    }

    public static User getCurrentUser()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.getPrincipal() instanceof UserDetails userDetails)
        {
            return userRepository.getUserByUsername(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException(""));
        }
        throw new UserNotFoundException("");
    }

    public static Company getCurrentCompany() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Company company) {
            return company;
        }
        throw new CompanyNotFoundException("A cég nem található!");
    }

    public static Employee getCurrentEmployee()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Employee employee) {
            return employee;
        }
        throw new EmployeeNotFoundException("Az alkalmazott nem található!");
    }

    public static UserDetails getCurrentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) throw new RuntimeException("No principal");
        return (UserDetails) auth.getPrincipal();
    }


}
