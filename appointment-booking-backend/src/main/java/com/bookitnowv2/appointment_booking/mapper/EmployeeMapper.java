package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchOptionsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.CompanyDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.PlaceDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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

    public EmployeeGetResponseDTO toGetDTO(EmployeeDocument employee)
    {

        return new EmployeeGetResponseDTO(
                employee.getName(),
                employee.getName(),
                employee.getAvatarUrl(),
                employee.getCompany(),
                employee.getRating()
        );
    }

    public CompanyDTO addCompanyDTO(EmployeeDocument employeeDocument)
    {
        return new CompanyDTO(employeeDocument.getCompany(), employeeDocument.getCompany(), "", 0.0);


    }

    public PlaceDTO addPlaceDTO(EmployeeDocument employeeDocument)
    {
        return new PlaceDTO(employeeDocument.getPlace(), employeeDocument.getPlace());
    }

    public SpecialistDTO addSpecialistDTO(EmployeeDocument employeeDocument)
    {
        return new SpecialistDTO(employeeDocument.getName(), employeeDocument.getName(), employeeDocument.getAvatarUrl(), employeeDocument.getCompany(), employeeDocument.getRating());
    }



    public EmployeeDocument toDocument(Employee employee) {
       return new EmployeeDocument(employee.getId(), employee.getName(), employee.getCompany().getCompanyName(), employee.getCompany().getPlace(), employee.getAvatarUrl(), employee.getRating());
    }

}
