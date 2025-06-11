package com.bookitnowv2.appointment_booking.elasticSearch.repository;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.entity.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface IElasticUserRepository extends ElasticsearchRepository<UserDocument, String> {
    List<User> findByName(String name);
}
