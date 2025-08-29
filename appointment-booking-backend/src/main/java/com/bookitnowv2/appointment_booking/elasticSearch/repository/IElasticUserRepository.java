package com.bookitnowv2.appointment_booking.elasticSearch.repository;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.entity.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface IElasticUserRepository extends ElasticsearchRepository<UserDocument, String> {
    List<UserDocument> findByName(String name);
    Optional<UserDocument> findById(Integer id);
}
