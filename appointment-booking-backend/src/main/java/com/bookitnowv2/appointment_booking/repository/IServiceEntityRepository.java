package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
}
