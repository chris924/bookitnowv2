package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> getEmployeeByEmail(String email);
    @Query("SELECT e FROM Employee e ORDER BY e.rating DESC")
    List<Employee> findTopRatedEmployees(Pageable pageable);
}
