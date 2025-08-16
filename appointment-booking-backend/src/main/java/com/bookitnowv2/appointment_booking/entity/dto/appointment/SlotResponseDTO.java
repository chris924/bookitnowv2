package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotResponseDTO {

    private Integer id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private String status;
}
