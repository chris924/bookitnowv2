package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticEmployeeService;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {


    private final IEmployeeRepository employeeRepository;
    private final ElasticEmployeeService elasticEmployeeService;
    private final EmployeeMapper employeeMapper;


    @Autowired
    EmployeeService( IEmployeeRepository employeeRepository,
                    EmployeeMapper employeeMapper, ElasticEmployeeService elasticEmployeeService)
    {

        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
        this.elasticEmployeeService = elasticEmployeeService;
    }

    public Employee saveEmployee(Employee employee)
    {
        elasticEmployeeService.saveEmployee(employee);
        return employeeRepository.save(employee);
    }

    public Employee getEmployeeByEmail(String email)
    {
        return employeeRepository.getEmployeeByEmail(email).orElseThrow(()-> new EmployeeNotFoundException(email));
    }

    public List<EmployeeGetResponseDTO> getMostRatedEmployees()
    {
       return employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20))
               .stream().map(employeeMapper::toGetDTO).toList();
    }




}
