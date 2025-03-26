package com.bookitnowv2.appointment_booking.entity.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {

    private String email;
    private String password;

}
