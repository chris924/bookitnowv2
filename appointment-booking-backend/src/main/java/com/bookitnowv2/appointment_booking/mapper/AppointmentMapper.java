package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.SlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentTableDataResponseDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class AppointmentMapper {

    public static AppointmentGetResponseDTO toGetDTO(Appointment appointment)
    {
        User user = appointment.getUser();
        ServiceEntity serviceEntity = appointment.getService();
        Employee employee = serviceEntity.getEmployee();
        Company company = serviceEntity.getCompany();

        LocalDateTime appointmentDateTime =
                LocalDateTime.of(appointment.getDate(), appointment.getStartTime());

        boolean isActive = appointmentDateTime.isAfter(LocalDateTime.now());

        return new AppointmentGetResponseDTO(
                toSlotResponseDTO(appointment),
                user.getId(),
                employee.getId(),
                employee.getName(),
                employee.getAvatarUrl(),
                company.getId(),
                company.getName(),
                company.getName(),
                serviceEntity.getName(),
                serviceEntity.getPrice(),
                isActive
        );
    }

    public static SlotResponseDTO toSlotResponseDTO(Appointment appointment)
    {
        String appointmentStatus = switch (appointment.getAppointmentStatus()) {
            case BOOKED -> "Booked";
            case CANCELLED -> "Cancelled";
            case FREE -> "Free";
        };

        return new SlotResponseDTO(
                appointment.getId(),
                appointment.getDate(),
                appointment.getStartTime(),
                appointment.getEndTime(),
                appointmentStatus
        );
    }

    public static EmployeeAppointmentTableDataResponseDTO toEmployeeAppointmentTableDataResponseDTO(Appointment appointment)
    {
        User foundUser = appointment.getUser();
        String userFullName;
        String userAvatar;
        if(foundUser == null) {
            userFullName = "";
            userAvatar = "";
        }
        else
        {
            userFullName = foundUser.getName();
            userAvatar = foundUser.getAvatarUrl();
        }

        LocalDateTime appointmentDateTime =
                LocalDateTime.of(appointment.getDate(), appointment.getStartTime());

        boolean isActive = appointmentDateTime.isAfter(LocalDateTime.now());


        return new EmployeeAppointmentTableDataResponseDTO(appointment.getId(), userFullName, userAvatar, appointment.getDate(), appointment.getStartTime()
        , appointment.getEndTime(), appointment.getService().getName(), appointment.getService().getDuration(), isActive);
    }




}
