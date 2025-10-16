package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticUserService;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final IUserRepository userRepository;

    private final ElasticUserService elasticUserService;

    UserService(IUserRepository userRepository, ElasticUserService elasticUserService)
    {
        this.userRepository = userRepository;
        this.elasticUserService = elasticUserService;
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
        elasticUserService.saveUser(user);
        return userRepository.save(user);
    }


}
