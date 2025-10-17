package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticCompanyService;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.stereotype.Service;
import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

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

    public CompanyGetResponseDTO getCompanyById(Long id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(id.toString()));
        return CompanyMapper.toGetDTO(foundCompany);

    }

    public Company getCompanyByIdTemp(Long id)
    {
        return companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(""));
    }

    public Company getCompanyByEmail(String email)
    {

        return companyRepository.getCompanyByEmail(email).orElseThrow(() -> new CompanyNotFoundException(email));

    }

    public void deleteCompanyById(Long id)
    {
        Company foundCompany = companyRepository.findById(id).orElseThrow(() -> new CompanyNotFoundException(id.toString()));

        companyRepository.delete(foundCompany);
    }

    public CompanyGetResponseDTO updateCompany(CompanyUpdateDTO updateDTO)
    {
        Company foundCompany = companyRepository.findById(updateDTO.getId()).orElseThrow(() -> new CompanyNotFoundException(updateDTO.getId().toString()));

        if(updateDTO.getName() != null) foundCompany.setName(updateDTO.getName());
        if(updateDTO.getServiceName() != null) foundCompany.setServiceName(updateDTO.getServiceName());
        if(updateDTO.getServiceDescription() != null) foundCompany.setServiceDescription(updateDTO.getServiceDescription());
        if(updateDTO.getDescription() != null) foundCompany.setDescription(updateDTO.getDescription());

        companyRepository.save(foundCompany);

        return CompanyMapper.toGetDTO(foundCompany);
    }



    @Transactional
    public List<CompanyAppointmentsByDateResponseDTO> getTotalAppointmentsByMonth(Integer monthCount)
    {


        Company authCompany = SecurityUtils.getCurrentCompany();
        Company currentCompany = this.getCompanyByIdTemp(authCompany.getId());

        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);

        return companyRepository.countTotalAppointmentsByDate(currentCompany.getId(), startDate, AppointmentStatus.BOOKED);
    }

}
