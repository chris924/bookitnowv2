package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AppointmentSlotResponseDTO {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private List<SlotResponseDTO> slotResponseDTO;

    private LocalTime firstHour;
    private LocalTime lastHour;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate firstDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastDate;


}
