package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyChangeEmailDTO {
    private Integer companyId;
    private String newEmail;
}
