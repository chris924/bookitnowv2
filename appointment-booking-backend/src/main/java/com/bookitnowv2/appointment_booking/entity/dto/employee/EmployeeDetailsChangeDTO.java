package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import lombok.Getter;

@Getter
public class EmployeeDetailsChangeDTO {

    private String name;
    private String username;
    private String email;
    private String about;
    private String phoneNumber;
    private EmployeeStatus status;
}
