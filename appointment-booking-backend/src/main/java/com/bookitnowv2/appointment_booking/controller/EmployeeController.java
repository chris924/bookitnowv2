package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeResponseDTO;
import com.bookitnowv2.appointment_booking.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService)
    {
        this.employeeService = employeeService;
    }

    @GetMapping("/most-rated")
    public ResponseEntity<?> getMostRatedEmployees()
    {
        List<EmployeeResponseDTO> topEmployees =  employeeService.getMostRatedEmployees();

        return ResponseEntity.status(HttpStatus.OK).body(topEmployees);
    }

}
