package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.SlotResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public static AppointmentGetResponseDTO toGetDTO(Appointment appointment)
    {
        User user = appointment.getUser();
        ServiceEntity serviceEntity = appointment.getService();
        Employee employee = serviceEntity.getEmployee();
        Company company = serviceEntity.getCompany();

        return new AppointmentGetResponseDTO(
                toSlotResponseDTO(appointment),
                user.getId(),
                employee.getId(),
                employee.getName(),
                employee.getAvatarUrl(),
                company.getId(),
                company.getName(),
                serviceEntity.getName(),
                serviceEntity.getPrice()
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




}
