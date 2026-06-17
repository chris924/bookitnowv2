package com.bookitnowv2.appointment_booking.exception;

public class EmployeeNotActiveException extends RuntimeException {
    public EmployeeNotActiveException(String message) {
        super(message);
    }
    public String getCode()
    {
        return "EMPLOYEE_NOT_ACTIVE";
    }
}
