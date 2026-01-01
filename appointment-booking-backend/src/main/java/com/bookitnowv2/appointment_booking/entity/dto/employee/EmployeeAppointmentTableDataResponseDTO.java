package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@Getter
@Setter
public class EmployeeAppointmentTableDataResponseDTO {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Long appointmentId;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String customerName;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String customerAvatar;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate date;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime startTime;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalTime endTime;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String serviceName;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Duration duration;



}
