package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;
    private final CompanyMapper companyMapper;

    @Autowired
    CompanyService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository,
                   CompanyMapper companyMapper)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.companyMapper = companyMapper;
    }

    public List<CompanyGetResponseDTO> getCompanies()
    {
        return companyRepository.findAll().stream().map(companyMapper::toGetDTO).toList();
    }

    public CompanyGetResponseDTO getCompanyById(Integer id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Company not found by Id!"));

        return companyMapper.toGetDTO(foundCompany);

    }

    public void deleteCompanyById(Integer id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Company not found by Id!"));

        companyRepository.delete(foundCompany);
    }

    public CompanyGetResponseDTO updateCompany(CompanyUpdateDTO updateDTO)
    {
        Company foundCompany = companyRepository.findById(updateDTO.getId()).orElseThrow(() -> new RuntimeException("Error: Company not found by Id!"));

        if(updateDTO.getCompanyName() != null) foundCompany.setCompanyName(updateDTO.getCompanyName());
        if(updateDTO.getServiceName() != null) foundCompany.setServiceName(updateDTO.getServiceName());
        if(updateDTO.getServiceDescription() != null) foundCompany.setServiceDescription(updateDTO.getServiceDescription());
        if(updateDTO.getDescription() != null) foundCompany.setDescription(updateDTO.getDescription());

        companyRepository.save(foundCompany);

        return companyMapper.toGetDTO(foundCompany);
    }


}
