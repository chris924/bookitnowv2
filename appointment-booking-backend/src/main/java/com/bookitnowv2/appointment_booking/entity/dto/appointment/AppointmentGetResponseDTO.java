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

    private SlotResponseDTO slotResponseDTO;

    @Nullable
    private Integer userId;

    private Integer employeeId;

    private String employeeName;

    private Integer companyId;

}
