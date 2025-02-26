package com.bookitnowv2.appointment_booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "companies")
public class Company implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Integer id;

    private String companyName;

    @JsonIgnore
    private String password;

    private String email;

    private String description;

    private Timestamp createdAt;

    private String serviceName;

    private String serviceDescription;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Employee> employees;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "company_role_junction",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> authorities;

    @Override
    public String getUsername() {
        return this.companyName;
    }

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


    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", companyName='" + companyName + '\'' +
                ", email='" + email + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    public Set<Appointment> getAppointments() {
        return employees.stream()
                .flatMap(employee -> employee.getAppointments().stream())
                .collect(Collectors.toSet());
    }

   public Set<Service> getServices()
   {
       return employees.stream().flatMap(employee -> employee.getServices().stream())
               .collect(Collectors.toSet());
   }
}
