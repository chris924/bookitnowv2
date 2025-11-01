package com.bookitnowv2.appointment_booking.entity.dto.appointment;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private SlotResponseDTO slotResponseDTO;

    @Nullable
    private Long userId;

    private Long employeeId;

    private String employeeName;

    private String employeeAvatarUrl;

    private Long companyId;

    private String companyName;

    private String name;

    private String serviceName;

    private Integer servicePrice;

}
