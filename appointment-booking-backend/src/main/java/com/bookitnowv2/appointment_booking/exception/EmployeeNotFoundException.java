package com.bookitnowv2.appointment_booking.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(String exception) {
        super("Employee not found: " + exception);
    }
}
