package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class AppointmentOverlapException extends RuntimeException {
    private final String code = "APPOINTMENT_OVERLAP";

    public AppointmentOverlapException(String message) {
        super(message);
    }
}
