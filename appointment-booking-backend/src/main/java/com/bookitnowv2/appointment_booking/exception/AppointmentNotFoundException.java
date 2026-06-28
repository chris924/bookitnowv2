package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class AppointmentNotFoundException extends RuntimeException {
    private final String code = "APPOINTMENT_NOT_FOUND";

    public AppointmentNotFoundException(String message) {
        super(message);
    }
}
