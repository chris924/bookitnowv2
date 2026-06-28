package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceEntityAddRequestDTO;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceEntityModifyRequestDTO;
import com.bookitnowv2.appointment_booking.exception.*;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.repository.IServiceEntityRepository;
import com.bookitnowv2.appointment_booking.utils.LoggedInInfo;
import com.bookitnowv2.appointment_booking.utils.LoggedInType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
public class ServiceEntityService {

    private final IServiceEntityRepository serviceEntityRepository;
    private final IEmployeeRepository employeeRepository;
    private  final ICompanyRepository companyRepository;
    private final EmployeeService employeeService;

    public ServiceEntityService(IServiceEntityRepository serviceEntityRepository, IEmployeeRepository employeeRepository,ICompanyRepository companyRepository, EmployeeService employeeService)
    {
        this.serviceEntityRepository = serviceEntityRepository;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.employeeService = employeeService;
    }

    public ServiceEntity getServiceEntityById(Long serviceId)
    {
        return serviceEntityRepository.findById(serviceId).orElseThrow(() -> new ServiceNotFoundException("Service entity not found"));
    }

    public void deleteService(ServiceEntity serviceEntity)
    {
        serviceEntityRepository.delete(serviceEntity);
    }

    @Transactional
    public void modifyServiceEntityFromCompanyOrEmployee(Long serviceEntityId, String employeeSlug, ServiceEntityModifyRequestDTO modifyRequestDTO)
    {

        Employee foundEmployee;
        Company foundCompany;

        ServiceEntity foundService = serviceEntityRepository.findById(serviceEntityId).orElseThrow(()-> new ServiceNotFoundException("Service not found"));

        foundService.setName(modifyRequestDTO.getName());
        Duration newDuration = Duration.ofMinutes(modifyRequestDTO.getDuration());
        foundService.setDuration(newDuration);
        foundService.setDescription(modifyRequestDTO.getDescription());
        foundService.setPrice(modifyRequestDTO.getPrice());

        LoggedInInfo info = SecurityUtils.getCurrentLoggedInId();

        if (info.type() == LoggedInType.EMPLOYEE) {

            foundEmployee = employeeRepository.findById(info.id())
                    .orElseThrow(() -> new EmployeeNotFoundException(info.id().toString()));

            if(foundService.getEmployee().getId() != foundEmployee.getId())
            {
                throw new ServiceAccessDeniedException("Not own service!");
            }

        } else if (info.type() == LoggedInType.COMPANY) {

            Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);

            foundEmployee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EmployeeNotFoundException(employeeId.toString()));

            foundCompany = companyRepository.findById(info.id())
                    .orElseThrow(() -> new CompanyNotFoundException(info.id().toString()));

            if (!foundEmployee.getCompany().getId().equals(foundCompany.getId())) {
                throw new AccessDeniedException("Not your employee!");
            }


        } else {
            throw new AccessDeniedException("Invalid logged-in type");
        }

        serviceEntityRepository.save(foundService);

    }


    @Transactional
    public void addServiceFromCompanyOrEmployee(
            String employeeSlug,
            ServiceEntityAddRequestDTO addRequestDTO
    ) {
        LoggedInInfo info = SecurityUtils.getCurrentLoggedInId();

        Duration newDuration = Duration.ofMinutes(addRequestDTO.getDuration());

        ServiceEntity newService = new ServiceEntity();
        newService.setName(addRequestDTO.getName());
        newService.setDuration(newDuration);
        newService.setPrice(addRequestDTO.getPrice());
        newService.setDescription(addRequestDTO.getDescription());

        Employee foundEmployee;
        Company foundCompany;

        if (info.type() == LoggedInType.EMPLOYEE) {

            foundEmployee = employeeRepository.findById(info.id())
                    .orElseThrow(() -> new EmployeeNotFoundException(info.id().toString()));

            foundCompany = foundEmployee.getCompany();

        } else if (info.type() == LoggedInType.COMPANY) {

            Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);

            foundEmployee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EmployeeNotFoundException(employeeId.toString()));

            foundCompany = companyRepository.findById(info.id())
                    .orElseThrow(() -> new CompanyNotFoundException(info.id().toString()));

            if (!foundEmployee.getCompany().getId().equals(foundCompany.getId())) {
                throw new AccessDeniedException("Not your employee!");
            }

        } else {
            throw new AccessDeniedException("Invalid logged-in type");
        }

        newService.setEmployee(foundEmployee);
        newService.setCompany(foundCompany);

        serviceEntityRepository.save(newService);
    }


    @Transactional
    public void deleteServiceFromCompanyOrEmployee(
            Long serviceEntityId,
            String employeeSlug
    ) {
        LoggedInInfo info = SecurityUtils.getCurrentLoggedInId();

        Employee foundEmployee;
        Company foundCompany;
        ServiceEntity foundService;

        if (info.type() == LoggedInType.EMPLOYEE) {

            foundEmployee = employeeRepository.findById(info.id())
                    .orElseThrow(() -> new EmployeeNotFoundException(info.id().toString()));


           foundService = serviceEntityRepository.findById(serviceEntityId).orElseThrow(() -> new ServiceNotFoundException("Service not found!"));

           if(foundService.getEmployee().getId() != foundEmployee.getId())
           {
               throw new ServiceAccessDeniedException("Not own service!");
           }

            serviceEntityRepository.delete(foundService);

        } else if (info.type() == LoggedInType.COMPANY) {

            Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);

            foundEmployee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EmployeeNotFoundException(employeeId.toString()));

            foundCompany = companyRepository.findById(info.id())
                    .orElseThrow(() -> new CompanyNotFoundException(info.id().toString()));

            if (!foundEmployee.getCompany().getId().equals(foundCompany.getId())) {
                throw new AccessDeniedException("Not your employee!");
            }

            foundService = serviceEntityRepository.findById(serviceEntityId).orElseThrow(() -> new ServiceNotFoundException("Service not found!"));

            if(foundService.getEmployee().getId() != foundEmployee.getId())
            {
                throw new ServiceAccessDeniedException("Not own service!");
            }

            serviceEntityRepository.delete(foundService);

        } else {
            throw new AccessDeniedException("Invalid logged-in type");
        }

    }
}
