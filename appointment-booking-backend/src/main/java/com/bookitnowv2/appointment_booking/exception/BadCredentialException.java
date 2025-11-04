package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class BadCredentialException extends RuntimeException {
    private final String code = "BAD_CREDENTIALS";
    public BadCredentialException(String message)
    {
        super(message);
    }
}
