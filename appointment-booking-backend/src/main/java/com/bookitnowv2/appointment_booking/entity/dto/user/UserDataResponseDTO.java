package com.bookitnowv2.appointment_booking.entity.dto.user;

import lombok.AllArgsConstructor;

import java.sql.Timestamp;

@AllArgsConstructor
public class UserDataResponseDTO {

    private String name;
    private String username;
    private String email;
    private String avatarUrl;
    private Timestamp createdAt;


}
