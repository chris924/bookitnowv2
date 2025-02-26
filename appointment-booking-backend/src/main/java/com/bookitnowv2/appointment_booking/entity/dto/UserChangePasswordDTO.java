package com.bookitnowv2.appointment_booking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserChangePasswordDTO {

    private Integer userId;
    private String newPassword;
}
