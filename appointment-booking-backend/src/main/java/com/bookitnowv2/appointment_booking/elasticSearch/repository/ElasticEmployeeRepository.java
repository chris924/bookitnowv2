package com.bookitnowv2.appointment_booking.elasticSearch.repository;

import com.bookitnowv2.appointment_booking.entity.Employee;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface ElasticEmployeeRepository extends ElasticsearchRepository<Employee, String> {

    List<Employee> findByName(String name);

}
