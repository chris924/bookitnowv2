package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceGetResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeePageForCompanyResponseDTO {
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        EmployeeGetResponseDTO employeeGetResponseDTO;
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        List<ServiceGetResponseDTO> employeeServices;
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        List<EmployeeWorkingHoursResponseDTO> employeeWorkingHours;
}
