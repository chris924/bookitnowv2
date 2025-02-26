package com.bookitnowv2.appointment_booking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyChangePasswordDTO {

    private Integer companyId;
    private String newPassword;
}
