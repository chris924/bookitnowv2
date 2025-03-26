package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Service
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    AppointmentService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository,
                       AppointmentMapper appointmentMapper)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.appointmentMapper = appointmentMapper;
    }

    public Appointment createAppointment(Integer serviceId, Timestamp timestamp) {
        ServiceEntity foundService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Error: Service not found by Id!"));

        Appointment newAppointment = createAppointmentFromService(foundService, timestamp);

        return appointmentRepository.save(newAppointment);
    }

    public List<AppointmentGetResponseDTO> getAppointmentsByCompanyId(Integer companyId)
    {
        Company foundCompany = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Error: Company not found by Id!"));

        Set<Appointment> appointmentSet = foundCompany.getAppointments();

        return appointmentSet.stream()
                .map(appointmentMapper::toGetDTO)
                .toList();
    }

    public List<AppointmentGetResponseDTO> getAppointments()
    {
        return appointmentRepository.findAll().stream().map(appointmentMapper::toGetDTO).toList();
    }

    public void deleteAppointmentById(Integer id)
    {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Appointment not found by Id!"));


        appointmentRepository.deleteById(id);
    }

    public void addUserToAppointment(Integer appointmentId, Integer userId)
    {
        Appointment foundAppointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Error: Appointment not found by Id!"));
        User foundUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException(("Error: User not found by Id!")));

        List<Appointment> userAppointments = foundUser.getAppointments();

        if(foundAppointment.getUser() != null) throw new RuntimeException("Error: Appointment already has an User!");
        if(!userAppointments.contains(foundAppointment)) throw new RuntimeException("Error: Appointment already added to the User!");

        foundAppointment.setUser(foundUser);
        foundUser.getAppointments().add(foundAppointment);
        appointmentRepository.save(foundAppointment);
        userRepository.save(foundUser);
    }

    public void deleteUserFromAppointment(Integer id)
    {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Appointment not found by Id!"));

        foundAppointment.setUser(null);
        appointmentRepository.save(foundAppointment);
    }



    private static @NotNull Appointment createAppointmentFromService(ServiceEntity foundService, Timestamp timestamp) {
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
