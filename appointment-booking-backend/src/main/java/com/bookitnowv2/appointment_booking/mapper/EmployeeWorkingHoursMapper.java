package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeWorkingHoursResponseDTO;

import java.util.List;

public class EmployeeWorkingHoursMapper {

    public static EmployeeWorkingHoursResponseDTO toEmployeeWorkingHoursResponseDTO(EmployeeWorkingHours employeeWorkingHours)
    {

        return new EmployeeWorkingHoursResponseDTO(employeeWorkingHours.getId(), employeeWorkingHours.getDate(), employeeWorkingHours.getStartTime(), employeeWorkingHours.getEndTime());
    }


}
