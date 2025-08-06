package com.bookitnowv2.appointment_booking.entity.dto.employee;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class EmployeeGetResponseDTO {

    public Integer id;
    public String label;
    public String value;
    public String image;
    public String company;
    public String place;
    public String about;
    public Double rating;

}
