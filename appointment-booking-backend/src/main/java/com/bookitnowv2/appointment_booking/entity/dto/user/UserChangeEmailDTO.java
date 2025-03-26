package com.bookitnowv2.appointment_booking.entity.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserChangeEmailDTO {

    private Integer userId;
    private String newEmail;
}
