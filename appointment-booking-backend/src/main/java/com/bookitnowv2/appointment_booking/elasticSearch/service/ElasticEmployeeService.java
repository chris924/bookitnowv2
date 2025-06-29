package com.bookitnowv2.appointment_booking.elasticSearch.service;

import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ElasticEmployeeService {

    private final IElasticEmployeeRepository elasticEmployeeRepository;
    private final EmployeeMapper employeeMapper;

    public ElasticEmployeeService(IElasticEmployeeRepository elasticEmployeeRepository, EmployeeMapper employeeMapper)
    {
        this.elasticEmployeeRepository = elasticEmployeeRepository;
        this.employeeMapper = employeeMapper;
    }

    public void saveEmployee(Employee employee)
    {
        elasticEmployeeRepository.save(employeeMapper.toDocument(employee));
    }

    public List<EmployeeGetResponseDTO> searchByName(String employeeName)
    {
        return elasticEmployeeRepository.findByName(employeeName).stream().map(employeeMapper::toGetDTO).toList();
    }
}
