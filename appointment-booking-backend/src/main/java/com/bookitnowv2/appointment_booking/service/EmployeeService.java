package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticEmployeeService;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.dto.employee.*;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EmployeeService {


    private final IEmployeeRepository employeeRepository;
    private final ElasticEmployeeService elasticEmployeeService;
    private final EmployeeWorkingHoursService workingHoursService;
    private final IAppointmentRepository appointmentRepository;


    @Autowired
    EmployeeService( IEmployeeRepository employeeRepository, ElasticEmployeeService elasticEmployeeService, EmployeeWorkingHoursService workingHoursService, IAppointmentRepository appointmentRepository)
    {

        this.employeeRepository = employeeRepository;
        this.elasticEmployeeService = elasticEmployeeService;
        this.workingHoursService = workingHoursService;
        this.appointmentRepository = appointmentRepository;
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

    public List<SpecialistDTO> getMostRatedEmployees()
    {
       return employeeRepository.findTopRatedEmployees(PageRequest.of(0, 20))
               .stream().map(EmployeeMapper::toSpecialistDTO).toList();
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

    public void deleteEmployee(Employee employee)
    {
        employeeRepository.delete(employee);
    }


    @Transactional
    public void updateEmployeeDataForCompany(String slug, EmployeeEditDataRequestDTO dto) {
        Long id = getEmployeeIdFromSlug(slug);
        Employee employee = getEmployeeById(id);
        Company company = SecurityUtils.getCurrentCompany();

        if (employee.getCompany() == null ||
                company == null ||
                !employee.getCompany().getId().equals(company.getId())) {
            throw new EmployeeNotFoundException(slug);
        }

        if (!Objects.equals(employee.getName(), dto.getName()))
            employee.setName(dto.getName());
        if (!Objects.equals(employee.getEmail(), dto.getEmail()))
            employee.setEmail(dto.getEmail());
        if (!Objects.equals(employee.getPhoneNumber(), dto.getPhoneNumber()))
            employee.setPhoneNumber(dto.getPhoneNumber());
        if (!Objects.equals(employee.getExperience(), dto.getExperience()))
            employee.setExperience(dto.getExperience());
        if(!Objects.equals(employee.getAbout(), dto.getBio()))
            employee.setAbout(dto.getBio());

        employeeRepository.save(employee);
    }

    public void deleteEmployeeWorkhourById(Long employeeId, String workhourId)
    {
        workingHoursService.delete(Long.parseLong(workhourId), employeeId);

    }

    public EmployeeSectionCardsResponseDTO getEmployeeSectionCardsData(Employee employee)
    {
        BigDecimal totalRevenue = appointmentRepository.getEmployeeTotalRevenue(employee.getId(), LocalDate.now());
        Double currentRating = employee.getRating();
        Long monthlyNewCustomers = appointmentRepository.getEmployeeMonthlyNewCustomers(employee.getId(), AppointmentStatus.BOOKED, LocalDate.now().withDayOfMonth(1));
        Long totalActiveAppointments = appointmentRepository.getEmployeeActiveAppointmentsCount(employee.getId(), LocalDate.now(), LocalTime.now(), AppointmentStatus.BOOKED);


        return EmployeeMapper.toEmployeeSectionCardsResponseDTO(totalRevenue, totalActiveAppointments, monthlyNewCustomers, currentRating);

    }



}
