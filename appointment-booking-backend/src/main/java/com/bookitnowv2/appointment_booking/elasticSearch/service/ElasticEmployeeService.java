package com.bookitnowv2.appointment_booking.elasticSearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchOptionsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchRequestDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.CompanyDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.PlaceDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;

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

    public EmployeeSearchOptionsResponseDTO searchByCriteria(EmployeeSearchRequestDTO dto) throws IOException {
        SearchResponse<EmployeeDocument> response;

        try{
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
        }catch (Exception e)
        {
            throw new RuntimeException(e);
        }



        EmployeeSearchOptionsResponseDTO result = new EmployeeSearchOptionsResponseDTO();
        result.setCompanies(new ArrayList<>());
        result.setPlaces(new ArrayList<>());
        result.setSpecialists(new ArrayList<>());

        for (Hit<EmployeeDocument> hit : response.hits().hits()) {
            EmployeeDocument hitEmployee = hit.source();
            if (hitEmployee != null) {
                CompanyDTO companyDTO = employeeMapper.addCompanyDTO(hitEmployee);
                PlaceDTO placeDTO = employeeMapper.addPlaceDTO(hitEmployee);
                SpecialistDTO specialistDTO = employeeMapper.addSpecialistDTO(hitEmployee);
                if(!result.companies.contains(companyDTO))
                {
                    result.companies.add(companyDTO);
                }
                if(!result.places.contains(placeDTO))
                {
                    result.places.add(placeDTO);
                }
                if(!result.specialists.contains(specialistDTO))
                {
                    result.specialists.add(specialistDTO);
                }
            }
        }

        return result;
    }

    private static BoolQuery.@NotNull Builder getBuilder(EmployeeSearchRequestDTO dto) {
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        boolean hasName = dto.getName() != null && !dto.getName().isBlank();
        boolean hasCompany = dto.getCompany() != null && !dto.getCompany().isBlank();
        boolean hasPlace = dto.getPlace() != null && !dto.getPlace().isBlank();

        if (hasName) {
            boolQuery.must(q -> q.matchPhrasePrefix(m -> m
                    .field("name")
                    .query(dto.getName())));
        }

        // 2. Company logic
        if (hasCompany) {

                // only company is filled 
                boolQuery.must(q -> q.matchPhrasePrefix(m -> m
                        .field("company")
                        .query(dto.getCompany())));

        }

        // 3. Place logic
        if (hasPlace) {

                // only place is filled — must restrict
                boolQuery.must(q -> q.matchPhrasePrefix(m -> m
                        .field("place")
                        .query(dto.getPlace())));

                // combine with others
                boolQuery.should(q -> q.term(t -> t.field("place").value(dto.getPlace())));

        }

        return boolQuery;
    }
}
