package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.utils.LoggedInInfo;
import com.bookitnowv2.appointment_booking.utils.LoggedInType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static IUserRepository userRepository;
    private static ICompanyRepository companyRepository;

    public SecurityUtils(IUserRepository userRepository)
    {
        SecurityUtils.userRepository = userRepository;
    }

    public static Long getCurrentUserId()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.getPrincipal() instanceof User user)
        {
            return user.getId();
        }
        throw new UserNotFoundException("A felhasználó nem található!");
    }

    public static Long getCurrentCompanyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Company company) {
            return company.getId();
        }
        throw new CompanyNotFoundException("A cég nem található!");
    }

    public static Long getCurrentEmployeeId()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Employee employee) {
            return employee.getId();
        }
        throw new EmployeeNotFoundException("Az alkalmazott nem található!");
    }

    public static UserDetails getCurrentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) throw new RuntimeException("No principal");
        return (UserDetails) auth.getPrincipal();
    }


    public static LoggedInInfo getCurrentLoggedInId()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.getPrincipal() instanceof User user)
        {
            return new LoggedInInfo(user.getId(), LoggedInType.USER);
        }
        else if(auth != null && auth.getPrincipal() instanceof Employee employee)
        {
            return new LoggedInInfo(employee.getId(), LoggedInType.EMPLOYEE);
        }
        else if(auth != null && auth.getPrincipal() instanceof Company company)
        {
            return new LoggedInInfo(company.getId(),LoggedInType.COMPANY);
        }

        throw new RuntimeException("Logged in type not found!");
    }

}
