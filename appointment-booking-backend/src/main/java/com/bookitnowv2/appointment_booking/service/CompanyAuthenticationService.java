package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class CompanyAuthenticationService {

    private final CompanyService companyService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public CompanyAuthenticationService(CompanyService companyService, AuthenticationManager authenticationManager,
                                        TokenService tokenService)
    {
        this.companyService = companyService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @Autowired
    private ICompanyRepository companyRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public CompanyRegistrationResponseDTO registerCompany(String companyName, String password, String email, String appServiceName, String appServiceDescription, String description)
    {
        try{

            String encodedPassword = passwordEncoder.encode(password);

            Role companyRole = roleRepository.findByAuthority("COMPANY").get();

            Set<Role> authorities = new HashSet<>();
            Set<Employee> employees = new HashSet<>();

            authorities.add(companyRole);

            Company newCompany = new Company();
            newCompany.setCompanyName(companyName);
            newCompany.setPassword(encodedPassword);
            newCompany.setDescription(description);
            newCompany.setEmail(email);
            newCompany.setAuthorities(authorities);
            newCompany.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            newCompany.setServiceName(appServiceName);
            newCompany.setEmployees(employees);
            newCompany.setServiceDescription(appServiceDescription);

           Company savedCompany = companyService.saveCompany(newCompany);

           return new CompanyRegistrationResponseDTO(savedCompany.getCompanyName(), savedCompany.getEmail());

        }catch (Exception e)
        {
            System.out.println("ERROR: " + e);
            return new CompanyRegistrationResponseDTO("","");
        }

    }

    public CompanyLoginResponseDTO loginCompany(String email, String password)
    {
        try{

            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            String token = tokenService.generateJwt(auth, companyRepository.getCompanyByEmail(email).get().getId());

            return new CompanyLoginResponseDTO(companyRepository.getCompanyByEmail(email).get().getCompanyName(), token);

        }catch (AuthenticationException e) {
            return new CompanyLoginResponseDTO(null, "");
        }


    }

    public Integer getCompanyData(String jwt)
    {

        return Integer.valueOf(tokenService.decodeJwt(jwt).getSubject());
    }


}
