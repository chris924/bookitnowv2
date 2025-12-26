package com.bookitnowv2.appointment_booking.service;

import co.elastic.clients.util.DateTime;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.workhour.WorkhourAddDTO;
import com.bookitnowv2.appointment_booking.repository.IAppointmentRepository;
import com.bookitnowv2.appointment_booking.repository.IEmployeeWorkingHoursRepository;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EmployeeWorkingHoursService
{
    private final IEmployeeWorkingHoursRepository employeeWorkingHoursRepository;
    private final AppointmentService appointmentService;
    private final IAppointmentRepository appointmentRepository;

    public EmployeeWorkingHoursService(IEmployeeWorkingHoursRepository employeeWorkingHoursRepository, AppointmentService appointmentService, IAppointmentRepository appointmentRepository)
    {
        this.employeeWorkingHoursRepository = employeeWorkingHoursRepository;
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
    }

    public EmployeeWorkingHours saveEmployeeWorkingHours(EmployeeWorkingHours employeeWorkingHours)
    {
        return employeeWorkingHoursRepository.save(employeeWorkingHours);
    }

    @Transactional
    public void delete(Long id, Long employeeId) {
        EmployeeWorkingHours wh = employeeWorkingHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Working hour not found"));

        if (!wh.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Not allowed");
        }
        for (Appointment app : wh.getAppointments()) {
            app.setAppointmentStatus(AppointmentStatus.CANCELLED);
            app.setWorkingHours(null);
        }
        appointmentRepository.saveAll(wh.getAppointments());

        //!! This automatically deletes all appointments via orphanRemoval if it is true!!
        employeeWorkingHoursRepository.delete(wh);
    }

    @Transactional
    public void edit(Long id, Employee employee, LocalTime newStart, LocalTime newEnd)
    {
        EmployeeWorkingHours wh = employeeWorkingHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Working hour not found"));

        if (!wh.getEmployee().getId().equals(employee.getId())) {
            throw new RuntimeException("Not allowed");
        }

        wh.setStartTime(newStart);
        wh.setEndTime(newEnd);

        List<ServiceEntity> serviceEntities = employee.getServices();

        for(ServiceEntity service : serviceEntities)
        {
            appointmentService.deleteAppointmentsAfterWorkhourChange(service);
            appointmentService.createFreeAppointmentSlotsFromService(service);
        }
    }

    @Transactional
    public void createWorkhourForEmployee(Employee employee, WorkhourAddDTO workhourAddDTO)
    {
        List<EmployeeWorkingHours> existingWorkinghours = employee.getWorkingHours();

        LocalDate startDate = workhourAddDTO.getFromDate();
        LocalDate endDate = workhourAddDTO.getToDate();

        for (LocalDate date = startDate; !date.isAfter(endDate);  date = date.plusDays(1))
        {
            LocalDate finalDate = date;

            boolean hasOverlap =
                    existingWorkinghours.stream()
                            .anyMatch(workingHour ->
                                    workingHour.getDate().equals(finalDate) &&
                                            workhourAddDTO.getStart().isBefore(workingHour.getEndTime()) &&
                                            workhourAddDTO.getEnd().isAfter(workingHour.getStartTime())
                            );

            if (hasOverlap) {
                throw new IllegalStateException("Overlapping working hour exists!");
            }

            EmployeeWorkingHours newWorkingHour = new EmployeeWorkingHours();
            newWorkingHour.setEmployee(employee);
            newWorkingHour.setDate(date);
            newWorkingHour.setStartTime(workhourAddDTO.getStart());
            newWorkingHour.setEndTime(workhourAddDTO.getEnd());

            employeeWorkingHoursRepository.save(newWorkingHour);
        }
    }
}
