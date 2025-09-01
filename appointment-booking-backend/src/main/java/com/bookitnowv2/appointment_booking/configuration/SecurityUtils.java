package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private static IUserRepository userRepository;

    public SecurityUtils(IUserRepository userRepository)
    {
        SecurityUtils.userRepository = userRepository;
    }

    public static User getCurrentUser()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null && auth.getPrincipal() instanceof UserDetails userDetails)
        {
            return userRepository.getUserByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("Error"));
        }
        throw new RuntimeException("Error");
    }


}
