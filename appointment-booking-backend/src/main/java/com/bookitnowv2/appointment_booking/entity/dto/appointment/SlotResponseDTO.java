package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotResponseDTO {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer id;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime start;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime end;
    private String status;
}
