package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
public class CompanyAppointmentsByDateResponseDTO {

    private LocalDate date;
    private Long count;
}
