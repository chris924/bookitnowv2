package com.bookitnowv2.appointment_booking.entity.dto.employee;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class EmployeeGetResponseDTO {

    public String type;
    public Long id;
    public String name;
    public String username;
    public String image;
    public String company;
    public String place;
    public String about;
    public Double rating;

}
