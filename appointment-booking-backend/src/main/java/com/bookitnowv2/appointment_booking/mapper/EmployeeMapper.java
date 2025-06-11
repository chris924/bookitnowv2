package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponseDTO toGetDTO(Employee employee)
    {

        return new EmployeeResponseDTO(
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
