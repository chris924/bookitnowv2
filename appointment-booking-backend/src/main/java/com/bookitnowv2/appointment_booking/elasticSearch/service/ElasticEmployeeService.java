package com.bookitnowv2.appointment_booking.elasticSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchRequestDTO;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@Service
public class ElasticEmployeeService {

    private final IElasticEmployeeRepository elasticEmployeeRepository;
    private final EmployeeMapper employeeMapper;
    private final ElasticsearchClient elasticsearchClient;

    public ElasticEmployeeService(IElasticEmployeeRepository elasticEmployeeRepository, EmployeeMapper employeeMapper, ElasticsearchClient elasticsearchClient)
    {
        this.elasticEmployeeRepository = elasticEmployeeRepository;
        this.employeeMapper = employeeMapper;
        this.elasticsearchClient = elasticsearchClient;
    }

    public void saveEmployee(Employee employee)
    {
        elasticEmployeeRepository.save(employeeMapper.toDocument(employee));
    }

    public List<EmployeeGetResponseDTO> searchByCriteria(EmployeeSearchRequestDTO dto) throws IOException {
        SearchResponse<EmployeeDocument> response;

        if ((dto.getCompany() == null || dto.getCompany().isBlank()) &&
                (dto.getName() == null || dto.getName().isBlank()) &&
                (dto.getPlace() == null || dto.getPlace().isBlank())) {

            response = elasticsearchClient.search(s -> s
                            .index("employees").query(q -> q.matchAll(m -> m)),
                    EmployeeDocument.class
            );

        } else {
            var boolQuery = getBuilder(dto);

            response = elasticsearchClient.search(s -> s
                            .index("employees")
                            .query(q -> q.bool(boolQuery.build())),
                    EmployeeDocument.class
            );
        }

        List<EmployeeGetResponseDTO> result = new ArrayList<>();

        for (Hit<EmployeeDocument> hit : response.hits().hits()) {
            EmployeeDocument hitEmployee = hit.source();
            if (hitEmployee != null) {
                result.add(employeeMapper.toGetDTO(hitEmployee));
            }
        }

        return result;
    }

    private static BoolQuery.@NotNull Builder getBuilder(EmployeeSearchRequestDTO dto) {
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        if (dto.getName() != null && !dto.getName().isBlank()) {
            boolQuery.must(q -> q.match(m -> m
                    .field("name")
                    .query(dto.getName())
                    .fuzziness("AUTO")));
        }

        if (dto.getCompany() != null && !dto.getCompany().isBlank()) {
            boolQuery.must(q -> q.prefix(p -> p
                    .field("company")
                    .value(dto.getCompany())));
        }

        if (dto.getPlace() != null && !dto.getPlace().isBlank()) {
            boolQuery.must(q -> q.prefix(p -> p
                    .field("place")
                    .value(dto.getPlace())));
        }
        return boolQuery;
    }
}
