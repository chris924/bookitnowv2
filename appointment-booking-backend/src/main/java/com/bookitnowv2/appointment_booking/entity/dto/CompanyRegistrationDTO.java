package com.bookitnowv2.appointment_booking.entity.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CompanyRegistrationDTO {

    private String companyName;

    private String email;

    private String password;

    private String appServiceName;

    private String appServiceDescription;

    private String  description;

}
