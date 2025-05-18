package com.bookitnowv2.appointment_booking.elasticSearch.repository;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.entity.Employee;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface ElasticEmployeeRepository extends ElasticsearchRepository<EmployeeDocument, String> {

    List<Employee> findByName(String name);

}
