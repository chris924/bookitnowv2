package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class AppointmentNotBookedException extends RuntimeException {
    private static final String title = "Az időpont nem foglalt";
    private final String code = "APPOINTMENT_NOT_BOOKED";

    public AppointmentNotBookedException(String message) {
        super(title + ": " + message);
    }
}
