package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import lombok.Getter;

import java.sql.Timestamp;

@Getter
public class AppointmentSaveDTO {

    private Integer companyId;

    private Integer employeeId;

    private Timestamp dateAndTime;

}
