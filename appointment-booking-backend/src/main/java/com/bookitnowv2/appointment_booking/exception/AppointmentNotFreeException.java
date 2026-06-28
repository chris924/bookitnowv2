package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class AppointmentNotFreeException extends RuntimeException {
    private final String code = "APPOINTMENT_NOT_FREE";

    public AppointmentNotFreeException(String message) {
        super(message);
    }
}
