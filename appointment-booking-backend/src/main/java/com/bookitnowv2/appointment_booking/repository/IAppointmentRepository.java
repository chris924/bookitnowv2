package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByUserId(Integer userId);

    @Query("""
    SELECT a FROM Appointment a
    WHERE a.service.id = :serviceId
      AND (a.date > :today OR (a.date = :today AND a.startTime >= :now))
""")
    List<Appointment> findUpcomingAppointments(
            @Param("serviceId") Integer serviceId,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now
    );
}
