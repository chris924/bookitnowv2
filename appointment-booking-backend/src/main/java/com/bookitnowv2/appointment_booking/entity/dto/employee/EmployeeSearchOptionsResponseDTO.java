package com.bookitnowv2.appointment_booking.entity.dto.employee;

import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.CompanyDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.PlaceDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class EmployeeSearchOptionsResponseDTO {

    public List<SpecialistDTO> specialists;
    public List<CompanyDTO> companies;
    public List<PlaceDTO> places;

}
