package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticCompanyService;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final ICompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final ElasticCompanyService elasticCompanyService;


    public CompanyService(ICompanyRepository companyRepository,
                   ElasticCompanyService elasticCompanyService,
                   CompanyMapper companyMapper)
    {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.elasticCompanyService = elasticCompanyService;
    }

    public Company saveCompany(Company company)
    {
        elasticCompanyService.saveCompany(company);
        return companyRepository.save(company);
    }

    public List<CompanyGetResponseDTO> getCompanies()
    {
        return companyRepository.findAll().stream().map(CompanyMapper::toGetDTO).toList();
    }

    public CompanyGetResponseDTO getCompanyById(Integer id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(id.toString()));
        return CompanyMapper.toGetDTO(foundCompany);

    }

    public Company getCompanyByEmail(String email)
    {

        return companyRepository.getCompanyByEmail(email).orElseThrow(() -> new CompanyNotFoundException(email));

    }

    public void deleteCompanyById(Integer id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(id.toString()));

        companyRepository.delete(foundCompany);
    }

    public CompanyGetResponseDTO updateCompany(CompanyUpdateDTO updateDTO)
    {
        Company foundCompany = companyRepository.findById(updateDTO.getId()).orElseThrow(() -> new CompanyNotFoundException(updateDTO.getId().toString()));

        if(updateDTO.getCompanyName() != null) foundCompany.setCompanyName(updateDTO.getCompanyName());
        if(updateDTO.getServiceName() != null) foundCompany.setServiceName(updateDTO.getServiceName());
        if(updateDTO.getServiceDescription() != null) foundCompany.setServiceDescription(updateDTO.getServiceDescription());
        if(updateDTO.getDescription() != null) foundCompany.setDescription(updateDTO.getDescription());

        companyRepository.save(foundCompany);

        return CompanyMapper.toGetDTO(foundCompany);
    }

    public List<CompanyAppointmentsByDateResponseDTO> getTotalAppointmentsByMonth(Integer monthCount)
    {
       Company currentCompany = SecurityUtils.getCurrentCompany();

       Set<Employee> employees = currentCompany.getEmployees();

        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);

       List<Appointment> appointments = employees.stream().flatMap(employee -> employee.getAppointments().stream().filter((appointment -> appointment.getDate().isAfter(startDate)))).toList();

       Map<LocalDate, Long> countByDate = appointments.stream().collect(Collectors.groupingBy(Appointment::getDate, Collectors.counting()));

        return countByDate.entrySet().stream()
                .map(entry -> CompanyMapper.toAppointmentsByDateResponseDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(CompanyAppointmentsByDateResponseDTO::getDate))
                .toList();
    }

}
