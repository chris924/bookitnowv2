package com.bookitnowv2.appointment_booking.repository;

import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> getCompanyByEmail(String email);
    Optional<Company> getCompanyByName(String name);

    @Query("""
    SELECT new com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO(a.date, COUNT(DISTINCT a.id), SUM(a.service.price))
    FROM Appointment a
    WHERE a.service.company.id = :companyId
        AND a.date > :startDate
        AND a.appointmentStatus = :appointmentStatus
    GROUP BY a.date
""")
    List<CompanyAppointmentsByDateResponseDTO> countTotalAppointmentsByDate(
            @Param("companyId") Long companyId,
            @Param("startDate") LocalDate startDate,
            @Param("appointmentStatus") AppointmentStatus appointmentStatus
            );


    @Query("""
    SELECT SUM(a.service.price)
    FROM Appointment a
    WHERE a.service.company.id = :companyId
      AND a.appointmentStatus = :status
""")
    Long getCompanyTotalRevenue(
            @Param("companyId") Long companyId,
            @Param("status") AppointmentStatus status
    );


    @Query("""
    SELECT COUNT(a)
    FROM Appointment a
    WHERE a.service.company.id = :companyId
      AND a.appointmentStatus = :status
      AND a.date > :startDate
""")
    Long getCompanyTotalActiveAppointments(
            @Param("companyId") Long companyId,
            @Param("status") AppointmentStatus status,
            @Param("startDate") LocalDate startDate
    );


    @Query("""
    SELECT e.name
    FROM Employee e
    WHERE e.company.id = :companyId
    ORDER BY e.rating DESC
""")
    List<String> getCompanyBestRatedEmployeeName(@Param("companyId") Long companyId, Pageable pageable);




    @Query("""
    SELECT COUNT(a)
    FROM Appointment a
    WHERE a.service.company.id = :companyId
      AND a.appointmentStatus = :status
      AND a.user.firstBookingDate >= :startMonthDate
""")
    Long getCompanyMonthlyNewCustomers(@Param("companyId") Long companyId, @Param("status") AppointmentStatus status, @Param("startMonthDate") LocalDate startMonthDate);

}
