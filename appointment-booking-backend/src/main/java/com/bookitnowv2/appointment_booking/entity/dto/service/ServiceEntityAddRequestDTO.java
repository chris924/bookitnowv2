package com.bookitnowv2.appointment_booking.entity.dto.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ServiceEntityAddRequestDTO {
    private String name;

    private String description;

    private Integer price;

    private Long duration;


}