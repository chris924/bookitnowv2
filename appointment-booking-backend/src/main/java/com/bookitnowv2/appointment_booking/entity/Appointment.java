package com.bookitnowv2.appointment_booking.entity;


import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="appointment_id")
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /*@ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference
    private Company company;*/

    @ManyToOne(optional = true) // Set to true, because it will be cancelled if the corresponding workingHour gets deleted
    @JoinColumn(name = "employee_working_hours_id", nullable = true)
    private EmployeeWorkingHours workingHours;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonBackReference
    private ServiceEntity service;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus appointmentStatus;

    private Integer rating;

}

