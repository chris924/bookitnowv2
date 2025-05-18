package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeGetResponseDTO toGetDTO(Employee employee)
    {

        return new EmployeeGetResponseDTO(
                employee.getName(),
                employee.getName(),
                employee.getAvatarUrl(),
                employee.getCompany().getCompanyName(),
                employee.getRating()
        );
    }

    public EmployeeDocument toDocument(Employee employee) {
        return new EmployeeDocument(
                employee.getId(),
                employee.getName(),
                employee.getCompany().getCompanyName()
        );
    }

}
