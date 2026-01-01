package com.bookitnowv2.appointment_booking.entity.dto.company;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@Data
public class AppointmentsByDateResponseDTO {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate date;
    private Long count;
    private Long income;
}
