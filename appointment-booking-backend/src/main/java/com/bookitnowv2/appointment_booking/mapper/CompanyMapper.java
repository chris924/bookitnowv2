package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.CompanyDocument;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class CompanyMapper {


    public static CompanyGetResponseDTO toGetDTO(Company company)
    {

        return new CompanyGetResponseDTO(
                "COMPANY",
                company.getName(),
                company.getPlace(),
                company.getServiceName(),
                company.getServiceDescription(),
                company.getDescription(),
                company.getEmail(),
                company.getRating()
        );
    }

    public CompanyDocument toDocument(Company company)
    {
        return new CompanyDocument(
                company.getId(),
                company.getName());
    }

    public static CompanyAppointmentsByDateResponseDTO toAppointmentsByDateResponseDTO(LocalDate date, Long count, Long income)
    {
        return new CompanyAppointmentsByDateResponseDTO(date, count, income);
    }
}
