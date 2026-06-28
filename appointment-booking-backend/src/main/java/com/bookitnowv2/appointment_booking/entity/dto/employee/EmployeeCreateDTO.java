package com.bookitnowv2.appointment_booking.entity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class EmployeeCreateDTO {
    private String name;
    private String username;
    private String email;
    private String password;
}
