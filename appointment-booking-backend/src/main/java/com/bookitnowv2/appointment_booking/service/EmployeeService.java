package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.elasticSearch.repository.ElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeGetResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;
    private final ElasticEmployeeRepository elasticEmployeeRepository;
    private final EmployeeMapper employeeMapper;


    @Autowired
    EmployeeService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository,
                    EmployeeMapper employeeMapper, ElasticEmployeeRepository elasticEmployeeRepository)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.elasticEmployeeRepository = elasticEmployeeRepository;
        this.employeeMapper = employeeMapper;
    }

    public void createEmployee()
    { //TODO
        // employeeRepository.save(employee); // DB
        //
        //    // Sync to Elasticsearch
        //    EmployeeDocument document = employeeMapper.toDocument(employee);
        //    elasticEmployeeRepository.save(document);
    }

    public List<EmployeeGetResponseDTO> getMostRatedEmployees()
    {
        List<Employee> employees = employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20));

       return employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20))
               .stream().map(employeeMapper::toGetDTO).toList();
    }

    public List<EmployeeGetResponseDTO> searchByName(String employeeName)
    {
       return elasticEmployeeRepository.findByName(employeeName).stream().map(employeeMapper::toGetDTO).toList();
    }


}
