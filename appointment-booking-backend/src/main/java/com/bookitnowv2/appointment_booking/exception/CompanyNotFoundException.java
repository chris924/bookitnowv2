package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class CompanyNotFoundException extends RuntimeException {
    private final String code = "COMPANY_NOT_FOUND";

    public CompanyNotFoundException(String message) {
        super(message);
    }
}
