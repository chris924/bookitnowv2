package com.bookitnowv2.appointment_booking.elasticSearch.repository;

import com.bookitnowv2.appointment_booking.elasticSearch.document.CompanyDocument;
import com.bookitnowv2.appointment_booking.entity.Company;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface IElasticCompanyRepository extends ElasticsearchRepository<CompanyDocument, String> {

    List<Company> findByName(String name);
}
