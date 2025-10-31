package com.bookitnowv2.appointment_booking.entity.dto.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;

import java.time.Duration;

@AllArgsConstructor
public class ServiceGetResponseDTO {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    public Long id;
    public String name;
    public String description;
    public Integer price;
    public long duration;

}
