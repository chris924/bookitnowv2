package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEmployeeWorkingHoursRepository  extends JpaRepository<EmployeeWorkingHours, Integer> {
}
