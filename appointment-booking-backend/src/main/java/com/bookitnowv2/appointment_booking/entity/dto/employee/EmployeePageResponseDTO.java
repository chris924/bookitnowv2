package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceGetResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class EmployeePageResponseDTO   {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    EmployeeGetResponseDTO employeeGetResponseDTO;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    List<ServiceGetResponseDTO> employeeServices;
}
