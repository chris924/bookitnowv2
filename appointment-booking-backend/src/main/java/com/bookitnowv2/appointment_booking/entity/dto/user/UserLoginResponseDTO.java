package com.bookitnowv2.appointment_booking.entity.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserLoginResponseDTO {

    private String email;
    private String jwt;

}
