package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> getEmployeeByEmail(String email);
    List<Employee> findByCompanyId(Long id);
    @Query("SELECT e FROM Employee e ORDER BY e.rating DESC")
    List<Employee> findTopRatedEmployees(Pageable pageable);





}
