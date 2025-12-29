package com.bookitnowv2.appointment_booking.entity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Data
@AllArgsConstructor
public class EmployeeSectionCardsResponseDTO {

    private BigDecimal totalRevenue;
    private Long totalActiveAppointments;
    private Long monthlyNewCustomers;
    private Double currentRating;

}
