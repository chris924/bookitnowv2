package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);

    @Query("""
    SELECT a FROM Appointment a
    WHERE a.service.id = :serviceId
      AND (a.date > :today OR (a.date = :today AND a.startTime >= :now))
      AND a.appointmentStatus = :status
""")
    List<Appointment> findUpcomingAppointments(
            @Param("serviceId") Long serviceId,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now,
            @Param("status") AppointmentStatus status
    );

    @Query("""
    SELECT a
    FROM Appointment a
    WHERE a.workingHours.id = :workingHourId
      AND a.service.employee.id = :employeeId
""")
    List<Appointment> findUpcomingAppointmentsForWorkingHour(
            @Param("employeeId") Long employeeId,
            @Param("workingHourId") Long workingHourId
    );

    @Query("""
    SELECT new com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO(a.date, COUNT(DISTINCT a.id), SUM(a.service.price))
    FROM Appointment a
    WHERE a.service.company.id = :companyId
        AND a.date > :startDate
        AND a.appointmentStatus = :appointmentStatus
    GROUP BY a.date
""")
    List<CompanyAppointmentsByDateResponseDTO> countCompanyTotalAppointmentsByDate(
            @Param("companyId") Long companyId,
            @Param("startDate") LocalDate startDate,
            @Param("appointmentStatus") AppointmentStatus appointmentStatus
    );

    @Query("""
    SELECT new com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentsByDateResponseDTO(a.date, COUNT(DISTINCT a.id))
    FROM Appointment a
    WHERE a.service.employee.id = :employeeId
        AND a.date > :startDate
        AND a.appointmentStatus = :appointmentStatus
    GROUP BY a.date
""")
    List<EmployeeAppointmentsByDateResponseDTO> getEmployeePreviousBookings(@Param("employeeId") Long employeeId, @Param("startDate")LocalDate startDate, @Param("appointmentStatus") AppointmentStatus appointmentStatus);

    @Query("""
    SELECT SUM(a.service.price)
    FROM Appointment a
    WHERE a.service.employee.id = :employeeId
      AND a.appointmentStatus = 'BOOKED'
      AND a.date <= :currentDate
""")
    BigDecimal getEmployeeTotalRevenue(@Param("employeeId") Long employeeId, @Param("currentDate") LocalDate currentDate);


    @Query("""
    SELECT COUNT(a)
    FROM Appointment a
    WHERE a.service.employee.id = :employeeId
      AND a.appointmentStatus = :status
      AND a.user.firstBookingDate >= :startMonthDate
""")
    Long getEmployeeMonthlyNewCustomers(@Param("employeeId") Long employeeId, @Param("status") AppointmentStatus status, @Param("startMonthDate") LocalDate startMonthDate);


    @Query("""
    SELECT COUNT(a) FROM Appointment a
    WHERE a.service.employee.id = :employeeId
      AND (a.date > :today OR (a.date = :today AND a.startTime >= :now))
      AND a.appointmentStatus = :status
""")
    Long getEmployeeActiveAppointmentsCount(
            @Param("employeeId") Long employeeId,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now,
            @Param("status") AppointmentStatus status
    );

}
