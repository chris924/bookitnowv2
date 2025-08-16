package com.bookitnowv2.appointment_booking.entity.dto.service;

import lombok.AllArgsConstructor;

import java.time.Duration;

@AllArgsConstructor
public class ServiceGetResponseDTO {

    public Integer id;
    public String name;
    public String description;
    public Integer price;
    public long duration;

}
