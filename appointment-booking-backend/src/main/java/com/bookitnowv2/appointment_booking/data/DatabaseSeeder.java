package com.bookitnowv2.appointment_booking.data;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseSeeder {

    private final IUserRepository userRepository;

    public DatabaseSeeder(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @NotNull
    private User createUser(String name, String username, String email, String password, Timestamp createdAt, List<Appointment> appointments, Set<Role> roles) {

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword("test");
        user.setCreatedAt(createdAt);
        user.setAuthorities(roles);
        user.setAppointments(appointments);

        userRepository.save(user);

        return user;
    }
}
