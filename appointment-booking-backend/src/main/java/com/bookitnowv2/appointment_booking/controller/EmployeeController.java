package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
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
    private final IElasticEmployeeRepository elasticEmployeeRepository;

    public EmployeeController(EmployeeService employeeService, IElasticEmployeeRepository elasticEmployeeRepository)
    {
        this.employeeService = employeeService;
        this.elasticEmployeeRepository = elasticEmployeeRepository;
    }

    @GetMapping("/most-rated")
    public ResponseEntity<?> getMostRatedEmployees()
    {
        List<EmployeeGetResponseDTO> topEmployees =  employeeService.getMostRatedEmployees();

        return ResponseEntity.status(HttpStatus.OK).body(topEmployees);
    }

   /* @GetMapping("/search-employee")
    public ResponseEntity<?> getSearchEmployee()
    {
        elasticEmployeeRepository.findByName()
    }*/

}
