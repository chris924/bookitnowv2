package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CompanySectionCardsResponseDTO {

    private Long totalRevenue;
    private Long totalActiveAppointments;
    private String bestRatedEmployee;
    private Long monthlyNewCustomers;

}
