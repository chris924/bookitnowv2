package com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SpecialistDTO {
    public Long id;
    public String label;
    public String value;
    public String image;
    public String company;
    public Double rating;
}
