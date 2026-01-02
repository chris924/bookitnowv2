package com.bookitnowv2.appointment_booking.exception.appointment;

public class AppointmentNotFoundException extends RuntimeException {
    private final String code = "APPOINTMENT_NOT_FOUND";

    public AppointmentNotFoundException(String message) {
        super(message);
    }
    public String getCode()
    {
        return this.code;
    }
}
