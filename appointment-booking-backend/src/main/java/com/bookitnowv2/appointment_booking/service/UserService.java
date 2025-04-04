package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final IUserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getUserByEmail(String email)
    {
        return userRepository.getUserByEmail(email).orElseThrow(); //TODO  << here custom exception with GlobalExceptionHandler
    }


}
