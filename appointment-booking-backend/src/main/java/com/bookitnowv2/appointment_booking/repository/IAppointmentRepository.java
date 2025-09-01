package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByUserId(Integer userId);
    List<Appointment> findByService_IdAndDateGreaterThanEqual(Integer serviceId, LocalDate date);
}
