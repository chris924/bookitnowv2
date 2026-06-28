package com.bookitnowv2.appointment_booking.entity.dto.company;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CompanyRegistrationDTO {

    private String name;

    private String email;

    private String password;

    private String appServiceName;

    private String appServiceDescription;

    private String  description;

    private String place;

}
