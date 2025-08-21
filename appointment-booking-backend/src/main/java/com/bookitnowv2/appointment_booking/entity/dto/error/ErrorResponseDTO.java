package com.bookitnowv2.appointment_booking.entity.dto.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
public class ErrorResponseDTO {
    private String code;
    private String message;
    private Integer status;
    private LocalDateTime timestamp;

    public ErrorResponseDTO(String code, String message, Integer status)
    {
        this.code = code;
        this.message = message;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

}
