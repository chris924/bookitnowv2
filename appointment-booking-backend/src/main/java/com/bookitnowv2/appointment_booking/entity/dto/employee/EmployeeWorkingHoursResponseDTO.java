package com.bookitnowv2.appointment_booking.entity.dto.employee;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private long id;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate date;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime startTime;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime endTime;

}
