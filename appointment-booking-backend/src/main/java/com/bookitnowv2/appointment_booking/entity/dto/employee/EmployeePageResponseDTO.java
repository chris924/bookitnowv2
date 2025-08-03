package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class EmployeePageResponseDTO {
    EmployeeGetResponseDTO employeeGetResponseDTO;
    List<ServiceEntity> employeeServices;
}
