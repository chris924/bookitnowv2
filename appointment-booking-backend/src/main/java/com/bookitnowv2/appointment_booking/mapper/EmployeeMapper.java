package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeePageResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.CompanyDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.PlaceDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EmployeeMapper {

    private final ServiceMapper serviceMapper;

    public EmployeeMapper(ServiceMapper serviceMapper)
    {
        this.serviceMapper = serviceMapper;
    }

    public static EmployeeGetResponseDTO toGetDTO(Employee employee)
    {

        return new EmployeeGetResponseDTO(
                "EMPLOYEE",
                employee.getId(),
                employee.getName(),
                employee.getName(),
                employee.getAvatarUrl(),
                employee.getCompany().getName(),
                employee.getCompany().getPlace(),
                employee.getAbout(),
                employee.getRating()
        );
    }

    public EmployeeGetResponseDTO toGetDTO(EmployeeDocument employeeDoc)
    {

        return new EmployeeGetResponseDTO(
                "EMPLOYEE",
                employeeDoc.getId(),
                employeeDoc.getName(),
                employeeDoc.getName(),
                employeeDoc.getAvatarUrl(),
                employeeDoc.getCompany(),
                employeeDoc.getPlace(),
                employeeDoc.getAbout(),
                employeeDoc.getRating()
        );
    }

    public CompanyDTO addCompanyDTO(EmployeeDocument employeeDocument)
    {
        return new CompanyDTO(employeeDocument.getCompany(), employeeDocument.getCompany(), employeeDocument.getCompanyAvatarUrl(), employeeDocument.getCompanyRating());


    }

    public PlaceDTO addPlaceDTO(EmployeeDocument employeeDocument)
    {
        return new PlaceDTO(employeeDocument.getPlace(), employeeDocument.getPlace());
    }

    public SpecialistDTO addSpecialistDTO(EmployeeDocument employeeDocument)
    {
        return new SpecialistDTO(employeeDocument.getId(), employeeDocument.getName(), employeeDocument.getName(), employeeDocument.getAvatarUrl(), employeeDocument.getCompany(), employeeDocument.getRating());
    }



    public EmployeeDocument toDocument(Employee employee) {
       return new EmployeeDocument(employee.getId(),
               employee.getName(),
               employee.getCompany().getName(),
               employee.getCompany().getAvatarUrl(),
               employee.getCompany().getRating(),
               employee.getCompany().getPlace(),
               employee.getAvatarUrl(),
               employee.getAbout(), 
               employee.getRating());

    }

    public EmployeePageResponseDTO toPageResponseDTO(Employee employee)
    {
        List<ServiceEntity> services = employee.getServices();
        return new EmployeePageResponseDTO(toGetDTO(employee), services.stream().map(serviceMapper::toGetDTO).toList());
    }

}
