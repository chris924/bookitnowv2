package com.bookitnowv2.appointment_booking.entity.dto.employee;


import lombok.Getter;
import lombok.Setter;

import javax.annotation.Nullable;

@Getter
@Setter
public class EmployeeSearchRequestDTO {
    @Nullable
    private String name;
    @Nullable
    private String company;
    @Nullable
    private String place;

}
