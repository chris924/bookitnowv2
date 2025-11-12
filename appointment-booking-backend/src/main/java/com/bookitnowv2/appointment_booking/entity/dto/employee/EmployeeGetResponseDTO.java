package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.utils.EmployeeExperience;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class EmployeeGetResponseDTO {

    public String type;
    public Long id;
    public String name;
    public String username;
    public String image;
    public String company;
    public String place;
    public String about;
    public Double rating;
    private String avatarUrl;
    private String email;
    private String phoneNumber;
    private EmployeeExperience experience;

}
