package com.bookitnowv2.appointment_booking.exception;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(String exception) {
        super("Company not found: " + exception);
    }
}
