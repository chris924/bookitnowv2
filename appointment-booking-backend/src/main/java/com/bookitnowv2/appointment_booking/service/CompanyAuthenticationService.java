package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class CompanyAuthenticationService {

    private final CompanyService companyService;
    private final TokenService tokenService;
    private final ICompanyRepository companyRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager companyAuthManager;
    //TODO: Have only 1 Company authentication service class, not 2 separate!
    public CompanyAuthenticationService(CompanyService companyService, @Qualifier("companyAuthManager") AuthenticationManager companyAuthManager,
                                        TokenService tokenService, ICompanyRepository companyRepository, IRoleRepository roleRepository, PasswordEncoder passwordEncoder)
    {
        this.companyService = companyService;
        this.companyAuthManager = companyAuthManager;
        this.tokenService = tokenService;
        this.companyRepository = companyRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public CompanyRegistrationResponseDTO registerCompany(String name, String password, String email, String appServiceName, String appServiceDescription, String description)
    {
        try{

            String encodedPassword = passwordEncoder.encode(password);

            Role companyRole = roleRepository.findByAuthority("COMPANY").get();

            Set<Role> authorities = new HashSet<>();
            List<Employee> employees = new ArrayList<>();

            authorities.add(companyRole);

            Company newCompany = new Company();
            newCompany.setName(name);
            newCompany.setPassword(encodedPassword);
            newCompany.setDescription(description);
            newCompany.setEmail(email);
            newCompany.setAuthorities(authorities);
            newCompany.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            newCompany.setServiceName(appServiceName);
            newCompany.setEmployees(employees);
            newCompany.setServiceDescription(appServiceDescription);

           Company savedCompany = companyService.saveCompany(newCompany);

           return new CompanyRegistrationResponseDTO(savedCompany.getName(), savedCompany.getEmail());

        }catch (Exception e)
        {
            throw new RuntimeException("Company registration failed: " + e.getMessage(), e);
        }

    }

    public String loginCompany(String email, String password)
    {
            Company company = companyService.getCompanyByEmail(email);

            Authentication auth = companyAuthManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            return tokenService.generateJwt(auth, company.getId());
    }

    public Integer getCompanyData(String jwt)
    {

        return Integer.valueOf(tokenService.decodeJwt(jwt).getSubject());
    }


}
