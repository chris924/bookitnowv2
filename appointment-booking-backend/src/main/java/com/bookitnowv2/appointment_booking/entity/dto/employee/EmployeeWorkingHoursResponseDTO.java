package com.bookitnowv2.appointment_booking.entity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeWorkingHoursResponseDTO {

    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;

}
