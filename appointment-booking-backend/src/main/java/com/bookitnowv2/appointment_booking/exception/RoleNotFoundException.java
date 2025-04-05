package com.bookitnowv2.appointment_booking.exception;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String ex)
    {
        super("Role not found: " + ex);
    }

}
