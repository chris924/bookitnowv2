package com.bookitnowv2.appointment_booking.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
public class EmployeeWorkingHours {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    private Employee employee;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private LocalTime startTime;
    private LocalTime endTime;


}
