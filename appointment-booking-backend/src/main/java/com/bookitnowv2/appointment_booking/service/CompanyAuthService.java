package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CompanyAuthService implements UserDetailsService {

    private final ICompanyRepository companyRepository;

    public CompanyAuthService(ICompanyRepository companyRepository)
    {
       this.companyRepository = companyRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("In the company details service");

        return companyRepository.getCompanyByEmail(email).orElseThrow(() -> new UsernameNotFoundException("company is not valid"));

    }

}