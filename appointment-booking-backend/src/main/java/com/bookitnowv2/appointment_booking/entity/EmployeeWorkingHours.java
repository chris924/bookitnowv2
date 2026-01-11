package com.bookitnowv2.appointment_booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class EmployeeWorkingHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="employee_working_hours_id")
    private Long id;

    private String name;

    @ManyToOne
    private Employee employee;

    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;

    @OneToMany(
            mappedBy = "workingHours",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}, // no REMOVE, because .ALL will remove every appointment on delete, instead of CANCELLED
            orphanRemoval = false
    )
    private List<Appointment> appointments = new ArrayList<>();

}
