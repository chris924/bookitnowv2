package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final String code = "USER_NOT_FOUND";

    public UserNotFoundException(String message)
    {
        super(message);
    }
}
