package com.bookitnowv2.appointment_booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class EmployeeWorkingHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="employee_working_hours_id")
    private int id;

    @ManyToOne
    private Employee employee;

    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;


}
