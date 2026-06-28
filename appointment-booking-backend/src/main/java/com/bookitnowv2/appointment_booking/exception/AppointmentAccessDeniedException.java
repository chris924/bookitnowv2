package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class AppointmentAccessDeniedException extends RuntimeException {
    private final String code = "APPOINTMENT_ACCESS_DENIED";

    public AppointmentAccessDeniedException(String message) {
        super(message);
    }
}
