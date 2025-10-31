package com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CompanyDTO {
    public Long Id;
    public String label;
    public String value;
    public String image;
    public Double rating;
}
