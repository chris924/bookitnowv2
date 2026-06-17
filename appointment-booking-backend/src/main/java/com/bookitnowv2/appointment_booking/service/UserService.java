package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final IUserRepository userRepository;

    UserService(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email)
    {
        return userRepository.getUserByEmail(email).orElseThrow(()-> new UserNotFoundException(email));
    }

    public User getUserByUsername(String username)
    {
        return userRepository.getUserByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
    }

    public User getUserById(Long id)
    {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id.toString()));
    }

    public User saveUser(User user)
    {
        return userRepository.save(user);
    }


}
