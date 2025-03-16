package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.Service;
import com.bookitnowv2.appointment_booking.repository.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;

public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;

    @Autowired
    AppointmentService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceRepository serviceRepository, IEmployeeRepository employeeRepository)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Appointment createAppointment(Integer serviceId, Timestamp timestamp) {
        Service foundService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Error: Service not found!"));

        Appointment newAppointment = createAppointmentFromService(foundService, timestamp);

        return appointmentRepository.save(newAppointment);
    }

    private static @NotNull Appointment createAppointmentFromService(Service foundService, Timestamp timestamp) {
        Company foundCompany = foundService.getCompany();
        Employee foundEmployee = foundService.getEmployee();

        if (foundCompany == null) throw new RuntimeException("Error: Company not found!");
        if (foundEmployee == null) throw new RuntimeException("Error: Employee not found!");

        Appointment newAppointment = new Appointment();
        newAppointment.setService(foundService);
        newAppointment.setCompany(foundCompany);
        newAppointment.setEmployee(foundEmployee);
        newAppointment.setDateAndTime(timestamp);

        return newAppointment;
    }

}
