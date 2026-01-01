package com.bookitnowv2.appointment_booking.entity;

import com.bookitnowv2.appointment_booking.utils.EmployeeExperience;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employees", indexes = { @Index(name = "idx_employee_rating", columnList = "rating")})
public class Employee implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long id;

    private String name;

    private String username;

    private String email;

    private String password;

    private String about;

    private Double rating;

    private EmployeeStatus status;

    private EmployeeExperience experience;

    private String phoneNumber;

    private Timestamp createdAt;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ServiceEntity> services = new ArrayList<>();

   /* @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Appointment> appointments = new ArrayList<>();*/

    @Transient
    public List<Appointment> getAppointments() {
        if (services == null) return List.of();

        List<Appointment> appointments = new ArrayList<>(services.stream()
                .filter(Objects::nonNull)
                .flatMap(s -> Optional.ofNullable(s.getAppointments()).orElse(List.of()).stream())
                .toList());

        appointments.sort(
                Comparator
                        .comparing(Appointment::getDate)
                        .thenComparing(Appointment::getStartTime)
                        .reversed()
        );

        return appointments;
    }

    @OneToMany(
            mappedBy = "employee",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<EmployeeWorkingHours> workingHours;

    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference
    private Company company;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "employee_role_junction",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> authorities;

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
