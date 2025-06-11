package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.CompanyDocument;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {


    public CompanyGetResponseDTO toGetDTO(Company company)
    {

        return new CompanyGetResponseDTO(
                company.getCompanyName(),
                company.getServiceName(),
                company.getServiceDescription(),
                company.getDescription(),
                company.getEmail()
        );
    }

    public CompanyDocument toDocument(Company company)
    {
        return new CompanyDocument(
                company.getId(),
                company.getCompanyName());
    }
}
