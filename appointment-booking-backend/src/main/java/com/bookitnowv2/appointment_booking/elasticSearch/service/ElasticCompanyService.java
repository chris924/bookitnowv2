package com.bookitnowv2.appointment_booking.elasticSearch.service;

import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticCompanyRepository;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import org.springframework.stereotype.Service;

@Service
public class ElasticCompanyService {

    private final IElasticCompanyRepository elasticCompanyRepository;
    private final CompanyMapper companyMapper;

    public ElasticCompanyService(IElasticCompanyRepository elasticCompanyRepository, CompanyMapper companyMapper)
    {
        this.elasticCompanyRepository = elasticCompanyRepository;
        this.companyMapper = companyMapper;
    }

    public void saveCompany(Company company)
    {
        elasticCompanyRepository.save(companyMapper.toDocument(company));
    }

}
