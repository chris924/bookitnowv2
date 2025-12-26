package com.bookitnowv2.appointment_booking.entity.dto.workhour;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class WorkhourAddDTO {
    private LocalTime start;
    private LocalTime end;

    @Schema(type = "string", format = "date", example = "2025-12-26")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fromDate;

    @Schema(type = "string", format = "date", example = "2025-12-31")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate toDate;

}
