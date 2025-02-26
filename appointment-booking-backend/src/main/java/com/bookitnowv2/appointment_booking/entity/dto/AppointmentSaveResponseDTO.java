package com.bookitnowv2.appointment_booking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppointmentSaveResponseDTO {

    private Integer appointmentId;

    private Timestamp dateAndTime;

}
