package com.bookitnowv2.appointment_booking.exception.appointment;

public class AppointmentNotBookedException extends RuntimeException {
    private static final String title = "Az időpont nem foglalt";
    private final String code = "APPOINTMENT_NOT_BOOKED";

    public AppointmentNotBookedException(String message) {
        super(title + ": " + message);
    }
    public String getCode()
    {
        return this.code;
    }

}
