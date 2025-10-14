package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private static IUserRepository userRepository;
    private static ICompanyRepository companyRepository;

    public SecurityUtils(IUserRepository userRepository)
    {
        SecurityUtils.userRepository = userRepository;
        SecurityUtils.companyRepository = companyRepository;
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

    public static Company getCurrentCompany()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.getPrincipal() instanceof UserDetails userDetails)
        {
            return companyRepository.getCompanyByCompanyName(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException(""));
        }
        throw new CompanyNotFoundException("A cég nem található!");
    }

    public static UserDetails getCurrentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) throw new RuntimeException("No principal");
        return (UserDetails) auth.getPrincipal();
    }


}
