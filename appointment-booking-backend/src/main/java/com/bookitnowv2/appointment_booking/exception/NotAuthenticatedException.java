package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class NotAuthenticatedException extends RuntimeException {
    private final String code = "NOT_AUTHENTICATED";

    public NotAuthenticatedException(String message) {
        super(message);
    }
}
