package com.bookitnowv2.appointment_booking.entity.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyGetResponseDTO {

    public String companyName;
    public String serviceName;
    public String serviceDescription;
    public String description;
    public String email;


}
