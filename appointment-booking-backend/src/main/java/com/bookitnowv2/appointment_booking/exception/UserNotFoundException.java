package com.bookitnowv2.appointment_booking.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String exception)
    {
        super("User not found: " + exception);
    }

}
