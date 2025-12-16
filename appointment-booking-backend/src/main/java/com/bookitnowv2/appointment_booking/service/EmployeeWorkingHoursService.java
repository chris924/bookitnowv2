package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.repository.IEmployeeWorkingHoursRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeWorkingHoursService
{
    private final IEmployeeWorkingHoursRepository employeeWorkingHoursRepository;
    private final AppointmentService appointmentService;

    public EmployeeWorkingHoursService(IEmployeeWorkingHoursRepository employeeWorkingHoursRepository, AppointmentService appointmentService)
    {
        this.employeeWorkingHoursRepository = employeeWorkingHoursRepository;
        this.appointmentService = appointmentService;
    }

    public EmployeeWorkingHours saveEmployeeWorkingHours(EmployeeWorkingHours employeeWorkingHours)
    {
        return employeeWorkingHoursRepository.save(employeeWorkingHours);
    }

    @Transactional
    public void delete(Long id, Long employeeId) {
        employeeWorkingHoursRepository.deleteByIdAndEmployee(id, employeeId);
        appointmentService.deleteOccupiedAppointmentsByWorkhour(id, employeeId);
    }

}
