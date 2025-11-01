package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.SlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.exception.appointment.AppointmentNotBookedException;
import com.bookitnowv2.appointment_booking.exception.appointment.AppointmentNotFreeException;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.*;
import java.util.*;

@Service
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    AppointmentService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, AppointmentMapper appointmentMapper)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.appointmentMapper = appointmentMapper;
    }

    public Appointment createAppointment(Long serviceId, Timestamp timestamp) {
        ServiceEntity foundService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Error: Service not found by Id!"));

        Appointment newAppointment = createAppointmentFromService(foundService, timestamp);

        return appointmentRepository.save(newAppointment);
    }

    public List<AppointmentGetResponseDTO> getAppointments()
    {
        return appointmentRepository.findAll().stream().map((AppointmentMapper::toGetDTO)).toList();
    }

    public void deleteAppointmentById(Long id)
    {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Appointment not found by Id!"));


        appointmentRepository.deleteById(id);
    }

    public Appointment getAppointmentById(Long appointmentId)
    {
        return appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Error: Appointment not found by id."));
    }


    public void addUserToAppointment(Appointment appointment, User user)
    {
        if(appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)
        {
            throw new AppointmentNotFreeException("Az időpont már foglalt.");
        }

        List<Appointment> userAppointments =  user.getAppointments();

        for (Appointment app : userAppointments) {
            if (appointment.getStartTime().isBefore(app.getEndTime()) &&
                    appointment.getEndTime().isAfter(app.getStartTime()) && app.getAppointmentStatus() == AppointmentStatus.BOOKED) {
                throw new RuntimeException("Error: Appointment overlapping with already booked appointment.");
            }
        }

        appointment.setUser(user);
        appointment.setAppointmentStatus(AppointmentStatus.BOOKED);
        user.getAppointments().add(appointment);

        LocalDate userFirstBookingDate = user.getFirstBookingDate();
        if(userFirstBookingDate == null)
        {
            user.setFirstBookingDate(appointment.getDate());
        }


        appointmentRepository.save(appointment);
        userRepository.save(user);
    }

    public void deleteUserFromAppointment(Long id)
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


        return newAppointment;
    }

    public void cancelBookedAppointment(Appointment appointment)
    {
        User appointmentUser = appointment.getUser();

        if(appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)
        {
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        }
        else
        {
            throw new AppointmentNotBookedException(appointment.getDate().toString());
        }

        if(appointmentUser.getFirstBookingDate() == appointment.getDate())
        {
            appointmentUser.setFirstBookingDate(null);
        }
        userRepository.save(appointmentUser);
        appointmentRepository.save(appointment);
    }

    public AppointmentSlotResponseDTO getAppointmentSlotsFromService(ServiceEntity serviceEntity)
    {
        AppointmentSlotResponseDTO appointmentSlotResponseDTO =  new AppointmentSlotResponseDTO();

        List<SlotResponseDTO> slotResponseDTOList = new ArrayList<>();

        appointmentSlotResponseDTO.setSlotResponseDTO(slotResponseDTOList);

        Employee employee = serviceEntity.getEmployee();
        List<EmployeeWorkingHours> employeeWorkingHours = employee.getWorkingHours();

        List<Appointment> existingAppointments = appointmentRepository.findUpcomingAppointments(serviceEntity.getId(), LocalDate.now(), LocalTime.now());

        LocalTime smallestStart = null;
        LocalTime largestEnd = null;
        LocalDate firstDate = null;
        LocalDate lastDate = null;

        for(Appointment x : existingAppointments)
        {

           LocalTime dayStartTime = x.getStartTime();
           LocalTime dayEndTime = x.getEndTime();
           LocalDate workingHourDate = x.getDate();

            if (smallestStart == null || dayStartTime.isBefore(smallestStart)) smallestStart = dayStartTime;
            if (largestEnd == null || dayEndTime.isAfter(largestEnd)) largestEnd = dayEndTime;
            if (firstDate == null || workingHourDate.isBefore(firstDate)) firstDate = workingHourDate;
            if (lastDate == null || workingHourDate.isAfter(lastDate)) lastDate = workingHourDate;

            SlotResponseDTO slotResponseDTO = new SlotResponseDTO();

            slotResponseDTO.setId(x.getId());
            slotResponseDTO.setStart(dayStartTime);
            slotResponseDTO.setEnd(dayEndTime);
            slotResponseDTO.setDate(workingHourDate);
            switch (x.getAppointmentStatus()) {
                case FREE -> slotResponseDTO.setStatus("FREE");
                case BOOKED -> slotResponseDTO.setStatus("BOOKED");
                case CANCELLED -> slotResponseDTO.setStatus("CANCELLED");
            }

            slotResponseDTOList.add(slotResponseDTO);


        };

        appointmentSlotResponseDTO.setFirstHour(smallestStart);
        appointmentSlotResponseDTO.setLastHour(largestEnd);
        appointmentSlotResponseDTO.setFirstDate(firstDate);
        appointmentSlotResponseDTO.setLastDate(lastDate);
        return appointmentSlotResponseDTO;
    }

    public void createFreeAppointmentSlotsFromService(ServiceEntity serviceEntity) // This will be called to create free appointments
    {

        Employee employee = serviceEntity.getEmployee();
        List<EmployeeWorkingHours> employeeWorkingHours = employee.getWorkingHours();
        List<Appointment> existingAppointments = serviceEntity.getAppointments();

        LocalTime smallestStart = null;
        LocalTime largestEnd = null;
        LocalDate firstDate = null;
        LocalDate lastDate = null;

        for(EmployeeWorkingHours x : employeeWorkingHours)
        {


            LocalTime dayStartTime = x.getStartTime();
            LocalTime dayEndTime = x.getEndTime();
            LocalDate workingHourDate = x.getDate();

            if (smallestStart == null || dayStartTime.isBefore(smallestStart)) smallestStart = dayStartTime;
            if (largestEnd == null || dayEndTime.isAfter(largestEnd)) largestEnd = dayEndTime;
            if (firstDate == null || workingHourDate.isBefore(firstDate)) firstDate = workingHourDate;
            if (lastDate == null || workingHourDate.isAfter(lastDate)) lastDate = workingHourDate;

            Duration serviceDuration = serviceEntity.getDuration();

            LocalTime current = dayStartTime;


            List<Appointment> currentExistingAppointments= existingAppointments.stream().filter(z -> z.getDate().equals(workingHourDate)).toList();

            while (!current.plus(serviceDuration).isAfter(dayEndTime)) {
                LocalTime slotStart = current;
                LocalTime slotEnd = current.plus(serviceDuration);

                // Skip past slots for today
                if (workingHourDate.isBefore(LocalDate.now()) ||
                        (workingHourDate.isEqual(LocalDate.now()) && slotStart.isBefore(LocalTime.now()))) {
                    current = slotEnd;
                    continue;
                }

                // Find if there's a conflict
                Optional<Appointment> conflict = currentExistingAppointments.stream()
                        .filter(i -> slotStart.isBefore(i.getEndTime()) && slotEnd.isAfter(i.getStartTime()))
                        .min(Comparator.comparing(Appointment::getStartTime));

                SlotResponseDTO slotResponseDTO = new SlotResponseDTO();
                slotResponseDTO.setDate(workingHourDate);

                Appointment newAppointment =  new Appointment();

                newAppointment.setDate(x.getDate());
                newAppointment.setService(serviceEntity);

                if (conflict.isPresent()) {
                    Appointment appt = conflict.get();

                    current = appt.getEndTime();
                } else {
                    newAppointment.setStartTime(slotStart);
                    newAppointment.setEndTime(slotEnd);
                    newAppointment.setAppointmentStatus(AppointmentStatus.FREE);

                    appointmentRepository.save(newAppointment);

                    // move to next slot
                    current = slotEnd;
                }


            }

        };

    }

    @Transactional
    public List<CompanyAppointmentsByDateResponseDTO> getCompanyTotalAppointmentsByMonth(Integer monthCount)
    {


        Company authCompany = SecurityUtils.getCurrentCompany();

        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);

        return appointmentRepository.countCompanyTotalAppointmentsByDate(authCompany.getId(), startDate, AppointmentStatus.BOOKED);
    }
}
