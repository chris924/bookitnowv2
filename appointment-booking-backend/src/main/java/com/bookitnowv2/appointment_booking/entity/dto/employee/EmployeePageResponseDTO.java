package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceGetResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class EmployeePageResponseDTO {
    EmployeeGetResponseDTO employeeGetResponseDTO;
    List<ServiceGetResponseDTO> employeeServices;
}
