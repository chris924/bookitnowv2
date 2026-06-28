package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class ServiceAccessDeniedException extends RuntimeException {
    private final String code = "SERVICE_ACCESS_DENIED";

    public ServiceAccessDeniedException(String message) {
        super(message);
    }
}
