package com.bookitnowv2.appointment_booking.entity.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PasswordChangeDTO {
    private String oldPassword;
    private String newPassword;
}
