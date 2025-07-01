package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticEmployeeService;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchOptionsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeSearchRequestDTO;
import com.bookitnowv2.appointment_booking.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final ElasticEmployeeService elasticEmployeeService;

    public EmployeeController(EmployeeService employeeService, ElasticEmployeeService elasticEmployeeService)
    {
        this.employeeService = employeeService;
        this.elasticEmployeeService = elasticEmployeeService;
    }

    @GetMapping("/most-rated")
    public ResponseEntity<?> getMostRatedEmployees()
    {
        List<EmployeeGetResponseDTO> topEmployees =  employeeService.getMostRatedEmployees();

        return ResponseEntity.status(HttpStatus.OK).body(topEmployees);
    }

    @PostMapping("/search-employee")
    public ResponseEntity<EmployeeSearchOptionsResponseDTO> getSearchEmployee(@Valid @RequestBody EmployeeSearchRequestDTO employeeSearchRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new RuntimeException("Bad body for criteria search!");
        }

        EmployeeSearchOptionsResponseDTO employeeResult;
        try {
            employeeResult = elasticEmployeeService.searchByCriteria(employeeSearchRequestDTO);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(employeeResult);
    }

}
