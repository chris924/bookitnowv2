package com.bookitnowv2.appointment_booking.elasticSearch.service;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticUserRepository;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class ElasticUserService {

    private final IElasticUserRepository elasticUserRepository;
    private final UserMapper userMapper;

    public ElasticUserService(IElasticUserRepository elasticUserRepository, UserMapper userMapper)
    {
        this.elasticUserRepository = elasticUserRepository;
        this.userMapper = userMapper;
    }

    public void saveUser(User user)
    {
        elasticUserRepository.save(userMapper.toDocument(user));
    }

    public UserDocument getUserDocument(User user)
    {
        return elasticUserRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("User not found in elastic repository!"));
    }

}
