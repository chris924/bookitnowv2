package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.AppointmentsByDateResponseDTO;
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
                company.getAvatarUrl(), 
                company.getServiceName(),
                company.getServiceDescription(),
                company.getDescription(),
                company.getEmail(),
                company.getRating()
        );
    }

    public static AppointmentsByDateResponseDTO toAppointmentsByDateResponseDTO(LocalDate date, Long count, Long income)
    {
        return new AppointmentsByDateResponseDTO(date, count, income);
    }
}
