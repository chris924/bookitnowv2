package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.repository.IEmployeeWorkingHoursRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployeeWorkingHoursService
{
    private final IEmployeeWorkingHoursRepository employeeWorkingHoursRepository;

    public EmployeeWorkingHoursService(IEmployeeWorkingHoursRepository employeeWorkingHoursRepository)
    {
        this.employeeWorkingHoursRepository = employeeWorkingHoursRepository;
    }

    public EmployeeWorkingHours saveEmployeeWorkingHours(EmployeeWorkingHours employeeWorkingHours)
    {
        return employeeWorkingHoursRepository.save(employeeWorkingHours);
    }

}
