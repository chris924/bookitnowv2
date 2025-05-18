package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.dto.employee.MostRatedEmployeesResponseDTO;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;


    @Autowired
    EmployeeService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository,
                    EmployeeMapper employeeMapper)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    public List<MostRatedEmployeesResponseDTO> getMostRatedEmployees()
    {
        List<Employee> employees = employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20));
        System.out.println("Found employees: " + employees.size());
       return employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20))
               .stream().map(employee -> new MostRatedEmployeesResponseDTO(employee.getName(), employee.getName(), employee.getAvatarUrl(), employee.getCompany().getCompanyName(), employee.getRating()
               )).toList();
    }



}
