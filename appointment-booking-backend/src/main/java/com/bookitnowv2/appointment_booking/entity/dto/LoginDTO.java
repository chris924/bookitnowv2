package com.bookitnowv2.appointment_booking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginDTO {
    public String email;
    public String password;
}
