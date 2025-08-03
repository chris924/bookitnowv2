package com.bookitnowv2.appointment_booking.entity.dto.service;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ServiceGetResponseDTO {

    public Integer id;
    public String name;
    public String description;
    public Integer price;
    public Integer duration;

}
