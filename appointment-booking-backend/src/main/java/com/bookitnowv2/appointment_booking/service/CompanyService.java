package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanySectionCardsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.CompanyMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class CompanyService {

    private final ICompanyRepository companyRepository;
    private final CompanyMapper companyMapper;


    public CompanyService(ICompanyRepository companyRepository,
                   CompanyMapper companyMapper)
    {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
    }

    public Company saveCompany(Company company)
    {
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
        Long authUserId = SecurityUtils.getCurrentEmployeeId();
        Company foundCompany = companyRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));

        if(updateDTO.getName() != null) foundCompany.setName(updateDTO.getName());
        if(updateDTO.getServiceName() != null) foundCompany.setServiceName(updateDTO.getServiceName());
        if(updateDTO.getServiceDescription() != null) foundCompany.setServiceDescription(updateDTO.getServiceDescription());
        if(updateDTO.getDescription() != null) foundCompany.setDescription(updateDTO.getDescription());

        companyRepository.save(foundCompany);

        return CompanyMapper.toGetDTO(foundCompany);
    }





    @Transactional
    public CompanySectionCardsResponseDTO getCompanySectionCardsData()
    {
        Long authCompanyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(authCompanyId).orElseThrow(() -> new CompanyNotFoundException(authCompanyId.toString()));
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);

        Long totalRevenue = Optional.ofNullable(
                companyRepository.getCompanyTotalRevenue(foundCompany.getId(), AppointmentStatus.BOOKED)
        ).orElse(0L);

        Long totalActiveAppointments = Optional.ofNullable(
                companyRepository.getCompanyTotalActiveAppointments(foundCompany.getId(), AppointmentStatus.BOOKED, LocalDate.now())
        ).orElse(0L);

        Long newCustomers = Optional.ofNullable(
                companyRepository.getCompanyMonthlyNewCustomers(foundCompany.getId(), AppointmentStatus.BOOKED, firstDayOfMonth)
        ).orElse(0L);
        String bestEmployee = companyRepository
                .getCompanyBestRatedEmployeeName(foundCompany.getId(), PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElse("—");

        return new CompanySectionCardsResponseDTO(totalRevenue, totalActiveAppointments, bestEmployee, newCustomers);
    }



}
