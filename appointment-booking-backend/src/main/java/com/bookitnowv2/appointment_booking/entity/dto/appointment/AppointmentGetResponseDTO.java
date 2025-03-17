package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppointmentGetResponseDTO {

    private Integer appointmentId;

    @Nullable
    private Integer userId;

    @Nullable
    private String userName;

    @Nullable
    private String userEmail;

    private Integer employeeId;

    private String employeeName;

    private Integer companyId;

    private Timestamp dateAndTime;
}
