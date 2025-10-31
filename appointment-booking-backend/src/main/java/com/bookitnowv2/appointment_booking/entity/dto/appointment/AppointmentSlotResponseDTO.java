package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import co.elastic.clients.util.DateTime;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
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
    private LocalDate firstDate;
    private LocalDate lastDate;


}
