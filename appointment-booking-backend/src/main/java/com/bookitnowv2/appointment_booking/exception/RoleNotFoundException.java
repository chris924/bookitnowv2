package com.bookitnowv2.appointment_booking.exception;

import lombok.Getter;

@Getter
public class RoleNotFoundException extends RuntimeException {
    private final String code = "ROLE_NOT_FOUND";
    public RoleNotFoundException(String message)
    {
        super(message);
    }

}
