package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentSlotResponseDTO {

    private Integer id;
    private LocalTime start;
    private LocalTime end;
    private String status;


}
