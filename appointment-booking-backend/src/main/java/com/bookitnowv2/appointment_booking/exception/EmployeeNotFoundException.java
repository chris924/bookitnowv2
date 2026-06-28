package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class EmployeeNotFoundException extends RuntimeException {
    private final String code = "EMPLOYEE_NOT_FOUND";

    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
