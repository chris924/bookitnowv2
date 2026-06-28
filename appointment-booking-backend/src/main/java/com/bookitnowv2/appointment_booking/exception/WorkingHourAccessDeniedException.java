package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class WorkingHourAccessDeniedException extends RuntimeException {
    private final String code = "WORKING_HOUR_ACCESS_DENIED";

    public WorkingHourAccessDeniedException(String message) {
        super(message);
    }
}
