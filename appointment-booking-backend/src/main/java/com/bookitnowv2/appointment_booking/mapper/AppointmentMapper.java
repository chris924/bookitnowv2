package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentGetResponseDTO toGetDTO(Appointment appointment)
    {
        User user = appointment.getUser();
        Employee employee = appointment.getEmployee();
        Company company = appointment.getCompany();

        return new AppointmentGetResponseDTO(
                appointment.getId(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                employee.getId(),
                employee.getName(),
                company.getId(),
                appointment.getDateAndTime()
        );
    }


}
