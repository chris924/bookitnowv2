package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.utils.EmployeeExperience;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class EmployeeDataTableResponseDTO {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private EmployeeExperience experience;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private EmployeeStatus status;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Long bookedAppointments;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Double rating;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String avatarUrl;
}
