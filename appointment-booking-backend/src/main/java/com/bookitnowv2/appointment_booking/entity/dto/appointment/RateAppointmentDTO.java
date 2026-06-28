package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RateAppointmentDTO {
    private Long appointmentId;
    private Integer rating;
}
