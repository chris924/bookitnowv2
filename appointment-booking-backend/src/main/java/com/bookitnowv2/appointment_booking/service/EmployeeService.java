package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticEmployeeService;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeDataTableResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {


    private final IEmployeeRepository employeeRepository;
    private final ElasticEmployeeService elasticEmployeeService;


    @Autowired
    EmployeeService( IEmployeeRepository employeeRepository, ElasticEmployeeService elasticEmployeeService)
    {

        this.employeeRepository = employeeRepository;
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

    public Employee getEmployeeById(Long id) {
        System.out.println("Searching for ID: " + id); // Debug log
        boolean exists = employeeRepository.existsById(id);
        System.out.println("Exists in DB: " + exists); // Debug log
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id.toString()));
    }

    public List<EmployeeGetResponseDTO> getMostRatedEmployees()
    {
       return employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20))
               .stream().map(EmployeeMapper::toGetDTO).toList();
    }

    // For extracting the id from the incoming slugs(name-id)
    public Long getEmployeeIdFromSlug(String slug) {
        try {
            String[] parts = slug.split("-");
            String idPart = parts[parts.length - 1];
            return Long.parseLong(idPart);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid slug format: " + slug);
        }
    }

    public List<EmployeeDataTableResponseDTO> getCompanyEmployeeTable()
    {
        List<EmployeeDataTableResponseDTO> employeeTable = new ArrayList<>();

        Company authCompany = SecurityUtils.getCurrentCompany();
        List<Employee> employees = employeeRepository.findByCompanyId(authCompany.getId());

        return employeeRepository.findByCompanyId(authCompany.getId()).stream().map(EmployeeMapper::toDataTableResponseDTO).toList();
    }


}
