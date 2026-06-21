package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.employee.*;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.CompanyDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.PlaceDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Component
public class EmployeeMapper {


    public EmployeeMapper()
    {

    }

    public static EmployeeGetResponseDTO toGetDTO(Employee employee)
    {

        return new EmployeeGetResponseDTO(
                "EMPLOYEE",
                employee.getId(),
                employee.getName(),
                employee.getUsername(),
                employee.getAvatarUrl(),
                employee.getCompany().getName(),
                employee.getCompany().getPlace(),
                employee.getAbout(),
                employee.getRating(),
                employee.getAvatarUrl(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getExperience(),
                employee.getStatus()
        );
    }

    public CompanyDTO addCompanyDTO(Employee employee)
    {
        Company company = employee.getCompany();
        return new CompanyDTO(employee.getId(), company.getName(), company.getName(), company.getAvatarUrl(), company.getRating());
    }

    public PlaceDTO addPlaceDTO(Employee employee)
    {
        String place = employee.getCompany().getPlace();
        return new PlaceDTO(place, place);
    }

    public SpecialistDTO addSpecialistDTO(Employee employee)
    {
        return new SpecialistDTO(employee.getId(), employee.getName(), employee.getName(), employee.getAvatarUrl(), employee.getCompany().getName(), employee.getRating());
    }

    public static SpecialistDTO toSpecialistDTO(Employee employee)
    {
        return new SpecialistDTO(employee.getId(), employee.getName(), employee.getName(), employee.getAvatarUrl(), employee.getCompany().getName(), employee.getRating());
    }

    public EmployeePageResponseDTO toPageResponseDTO(Employee employee)
    {
        List<ServiceEntity> services = employee.getServices();
        return new EmployeePageResponseDTO(toGetDTO(employee), services.stream().map(ServiceMapper::toGetDTO).toList());
    }

    public static EmployeeDataTableResponseDTO toDataTableResponseDTO(Employee employee)
    {
        Long bookedAppointmentsCount = employee.getAppointments().stream().filter((app) -> app.getAppointmentStatus() == AppointmentStatus.BOOKED && app.getDate().isAfter(LocalDate.now())).count();

        return new EmployeeDataTableResponseDTO(employee.getId(), employee.getName(), employee.getExperience(), employee.getStatus(), bookedAppointmentsCount, employee.getRating(), employee.getAvatarUrl());
    }

    public static EmployeePageForCompanyResponseDTO toEmployeePageForCompanyResponseDTO(Employee employee)
    {
        List<ServiceEntity> services = employee.getServices();
        List<EmployeeWorkingHours> workingHours = employee.getWorkingHours();

        return new EmployeePageForCompanyResponseDTO(toGetDTO(employee),  services.stream().map(ServiceMapper::toGetDTO).toList(), workingHours.stream().map(EmployeeWorkingHoursMapper::toEmployeeWorkingHoursResponseDTO).toList());
    }

    public static EmployeeSectionCardsResponseDTO toEmployeeSectionCardsResponseDTO(BigDecimal totalRevenue, Long totalActiveAppointments, Long monthlyNewCustomers, Double currentRating)
    {

        return new EmployeeSectionCardsResponseDTO(totalRevenue, totalActiveAppointments, monthlyNewCustomers, currentRating);
    }
}
