package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IEmployeeWorkingHoursRepository  extends JpaRepository<EmployeeWorkingHours, Long> {

    @Modifying
    @Query("""
    DELETE FROM EmployeeWorkingHours e
    WHERE e.id = :id AND e.employee.id = :employeeId
""")
    void deleteByIdAndEmployee(
            @Param("id") Long id,
            @Param("employeeId") Long employeeId
    );
}
