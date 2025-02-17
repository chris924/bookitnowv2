package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> getCompanyByEmail(String email);
    Optional<Company> getCompanyByCompanyName(String companyName);
}
