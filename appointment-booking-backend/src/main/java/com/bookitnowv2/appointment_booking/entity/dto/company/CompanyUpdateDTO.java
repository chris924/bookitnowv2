package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CompanyUpdateDTO {

    private String name;
    private String email;
    private String description;
    private String serviceName;
    private String serviceDescription;
}
