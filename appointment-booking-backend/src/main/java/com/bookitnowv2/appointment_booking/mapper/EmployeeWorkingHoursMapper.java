package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.EmployeeBreakTimes;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.dto.EmployeeBreakTimesResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeWorkingHoursResponseDTO;

import java.util.List;

public class EmployeeWorkingHoursMapper {

    public static EmployeeWorkingHoursResponseDTO toEmployeeWorkingHoursResponseDTO(EmployeeWorkingHours employeeWorkingHours)
    {
        List<EmployeeBreakTimes> breakTimes = employeeWorkingHours.getBreakTimes();
        List<EmployeeBreakTimesResponseDTO> breakTimesDTO = breakTimes.stream().map(EmployeeWorkingHoursMapper::toEmployeeBreakTimesResponseDTO).toList();

        return new EmployeeWorkingHoursResponseDTO(employeeWorkingHours.getId(), employeeWorkingHours.getDate(), employeeWorkingHours.getStartTime(), employeeWorkingHours.getEndTime(), breakTimesDTO);
    }

    public static EmployeeBreakTimesResponseDTO toEmployeeBreakTimesResponseDTO(EmployeeBreakTimes employeeBreakTimes)
    {
        return  new EmployeeBreakTimesResponseDTO(employeeBreakTimes.getId(), employeeBreakTimes.getDate(), employeeBreakTimes.getBreakStartTime(), employeeBreakTimes.getBreakEndTime());
    }
}
