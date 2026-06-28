package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class ServiceNotFoundException extends RuntimeException {
    private final String code = "SERVICE_NOT_FOUND";

    public ServiceNotFoundException(String message) {
        super(message);
    }
}
