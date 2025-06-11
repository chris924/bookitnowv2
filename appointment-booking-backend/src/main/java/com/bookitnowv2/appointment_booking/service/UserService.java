package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticUserRepository;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.UserMapper;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final IUserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    private final IElasticUserRepository elasticUserRepository;

    UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, IElasticUserRepository elasticUserRepository)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.elasticUserRepository = elasticUserRepository;
    }

    public User getUserByEmail(String email)
    {
        return userRepository.getUserByEmail(email).orElseThrow(()-> new UserNotFoundException(email));
    }

    public User getUserByUsername(String username)
    {
        return userRepository.getUserByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
    }

    public User getUserById(Integer id)
    {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id.toString()));
    }

    public User saveUser(User user)
    {
        UserDocument userDocument = userMapper.toDocument(user);
        elasticUserRepository.save(userDocument);
        return userRepository.save(user);
    }


}
