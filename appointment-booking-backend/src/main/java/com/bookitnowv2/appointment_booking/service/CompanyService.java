package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.document.CompanyDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticCompanyRepository;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
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
    private final IElasticCompanyRepository elasticCompanyRepository;

    @Autowired
    CompanyService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository,
                   IElasticCompanyRepository elasticCompanyRepository,
                   CompanyMapper companyMapper)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.companyMapper = companyMapper;
        this.elasticCompanyRepository = elasticCompanyRepository;
    }

    public Company saveCompany(Company company)
    {
        CompanyDocument companyDocument = companyMapper.toDocument(company);
        elasticCompanyRepository.save(companyDocument);
        return companyRepository.save(company);
    }

    public List<CompanyGetResponseDTO> getCompanies()
    {
        return companyRepository.findAll().stream().map(companyMapper::toGetDTO).toList();
    }

    public CompanyGetResponseDTO getCompanyById(Integer id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(id.toString()));

        return companyMapper.toGetDTO(foundCompany);

    }

    public CompanyGetResponseDTO getCompanyByEmail(String email)
    {
        Company foundCompany = companyRepository.getCompanyByEmail(email).orElseThrow(() -> new CompanyNotFoundException(email));

        return companyMapper.toGetDTO(foundCompany);

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

        return companyMapper.toGetDTO(foundCompany);
    }


}
