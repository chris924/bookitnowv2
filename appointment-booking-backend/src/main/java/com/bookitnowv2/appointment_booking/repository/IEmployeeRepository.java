package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

public interface IEmployeeRepository extends JpaRepository<Employee, Integer> {
    @Query("SELECT e FROM Employee e ORDER BY e.rating DESC")
    List<Employee> findTopRatedEmployees(Pageable pageable);
}
