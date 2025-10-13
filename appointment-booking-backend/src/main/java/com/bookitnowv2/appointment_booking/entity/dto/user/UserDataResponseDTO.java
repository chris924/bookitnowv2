package com.bookitnowv2.appointment_booking.entity.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@Getter
@Setter
public class UserDataResponseDTO {

    private String type;
    private Integer id;
    private String name;
    private String username;
    private String email;
    private String avatarUrl;
    private Timestamp createdAt;


}
