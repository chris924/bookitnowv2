package com.bookitnowv2.appointment_booking.entity.dto;

import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDataResponseDTO;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
public class AuthInfoResponseDTO {

    private UserDataResponseDTO userGetResponseDTO;
    private CompanyGetResponseDTO companyGetResponseDTO;
    private EmployeeGetResponseDTO employeeGetResponseDTO;

}
