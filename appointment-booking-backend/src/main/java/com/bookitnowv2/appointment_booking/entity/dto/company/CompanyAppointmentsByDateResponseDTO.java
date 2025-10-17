package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@Data
public class CompanyAppointmentsByDateResponseDTO {

    private LocalDate date;
    private Long count;
    private Long income;
}
