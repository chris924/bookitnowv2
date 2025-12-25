package com.bookitnowv2.appointment_booking.entity.dto.workhour;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class WorkhourEditDTO {
    private LocalTime newStart;
    private LocalTime newEnd;
}
