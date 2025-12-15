package com.bookitnowv2.appointment_booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class EmployeeBreakTimes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDate date;
    private LocalTime breakStartTime;
    private LocalTime breakEndTime;

    @ManyToOne
    @JoinColumn(name = "employee_working_hours_id")
    private EmployeeWorkingHours workingHours;
}
