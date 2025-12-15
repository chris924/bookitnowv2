package com.bookitnowv2.appointment_booking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeBreakTimesResponseDTO {

    private long id;

    private LocalDate date;
    private LocalTime breakStartTime;
    private LocalTime breakEndTime;


}
