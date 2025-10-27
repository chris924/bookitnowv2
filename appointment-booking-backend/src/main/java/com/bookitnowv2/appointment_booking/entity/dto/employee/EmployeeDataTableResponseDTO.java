package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.utils.EmployeeExperience;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class EmployeeDataTableResponseDTO {
    private Long id;
    private String name;
    private EmployeeExperience experience;
    private EmployeeStatus status;
    private Long bookedAppointments;
    private Double rating;
}
