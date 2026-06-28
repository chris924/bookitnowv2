package com.bookitnowv2.appointment_booking.controller;


import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.EmployeeWorkingHours;
import com.bookitnowv2.appointment_booking.entity.dto.company.AppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.*;
import com.bookitnowv2.appointment_booking.entity.dto.employee.SearchOptionDetails.SpecialistDTO;
import com.bookitnowv2.appointment_booking.entity.dto.workhour.WorkhourAddDTO;
import com.bookitnowv2.appointment_booking.entity.dto.workhour.WorkhourEditDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.exception.EmployeeNotFoundException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.mapper.EmployeeWorkingHoursMapper;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IEmployeeRepository;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.service.EmployeeService;
import com.bookitnowv2.appointment_booking.service.EmployeeWorkingHoursService;
import com.bookitnowv2.appointment_booking.service.ServiceEntityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AppointmentService appointmentService;
    private final IEmployeeRepository employeeRepository;
    private final ServiceEntityService serviceEntityService;
    private final EmployeeWorkingHoursService employeeWorkingHoursService;
    private final EmployeeMapper employeeMapper;
    private final ICompanyRepository companyRepository;
    private final Path basePath;
    private final String frontendAddress;

    public EmployeeController(EmployeeService employeeService, ICompanyRepository companyRepository,@Value("${avatar.user.directory.path}") String basePath,
                              @Value("${frontend.ip.address}") String frontendAddress, IEmployeeRepository employeeRepository, ServiceEntityService serviceEntityService, AppointmentService appointmentService, EmployeeWorkingHoursService employeeWorkingHoursService, EmployeeMapper employeeMapper)
    {
        this.employeeService = employeeService;
        this.serviceEntityService = serviceEntityService;
        this.appointmentService = appointmentService;
        this.employeeWorkingHoursService = employeeWorkingHoursService;
        this.employeeMapper = employeeMapper;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;

        this.basePath = Paths.get(basePath);
        this.frontendAddress = frontendAddress;

    }

    @GetMapping("/most-rated")
    public ResponseEntity<List<SpecialistDTO>> getMostRatedEmployees()
    {
        List<SpecialistDTO> topEmployees =  employeeService.getMostRatedEmployees();

        return ResponseEntity.ok(topEmployees);
    }

    @GetMapping("/{employeeSlug}")
    public ResponseEntity<EmployeePageResponseDTO> getEmployeePage(@PathVariable String employeeSlug) {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employeeMapper.toPageResponseDTO(foundEmployee));
    }

    @PostMapping("/search-employee")
    public ResponseEntity<EmployeeSearchOptionsResponseDTO> getSearchEmployee(@Valid @RequestBody EmployeeSearchRequestDTO employeeSearchRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new IllegalArgumentException("Bad body for criteria search!");
        }

        EmployeeSearchOptionsResponseDTO employeeResult = employeeService.searchByCriteria(employeeSearchRequestDTO);

        return ResponseEntity.ok(employeeResult);
    }

    @GetMapping("/employee-table")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<EmployeeDataTableResponseDTO>> getCompanyEmployeeTable()
    {
        List<EmployeeDataTableResponseDTO> employeeTableData = employeeService.getCompanyEmployeeTable();
        return ResponseEntity.ok(employeeTableData);
    }

    @GetMapping("/{employeeSlug}/previous-booking-stat")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<List<EmployeeAppointmentsByDateResponseDTO>> getEmployeePreviousBookingStat(@PathVariable String employeeSlug)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        List<EmployeeAppointmentsByDateResponseDTO> appointments = appointmentService.getEmployeePreviousBookingsByMonth(foundEmployee);

        return ResponseEntity.ok().body(appointments);
    }

    @DeleteMapping("/{employeeSlug}/delete-employee")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> deleteSpecificEmployee(@PathVariable String employeeSlug)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);
        employeeService.deleteEmployee(foundEmployee);
        return ResponseEntity.ok().body("Alkalmazott törölve");
    }

    @PutMapping("/company{employeeSlug}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> editEmployeeDataForCompany(@PathVariable String employeeSlug, @Valid @RequestBody EmployeeEditDataRequestDTO employeeEditDataRequestDTO)
    {
        employeeService.updateEmployeeDataForCompany(employeeSlug, employeeEditDataRequestDTO);
        return ResponseEntity.ok().body("Adatok sikeresen módosítva!");
    }

    @GetMapping("/company/{employeeSlug}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<EmployeePageForCompanyResponseDTO> getEmployeePageDataForCompany(@PathVariable String employeeSlug)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        Long authCompanyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(authCompanyId).orElseThrow(() -> new CompanyNotFoundException(authCompanyId.toString()));


        if (foundEmployee.getCompany() == null ||
                foundCompany == null ||
                !foundEmployee.getCompany().getId().equals(foundCompany.getId())) {
            throw new EmployeeNotFoundException(employeeSlug);
        }

        EmployeePageForCompanyResponseDTO employeePageForCompanyResponseDTO = EmployeeMapper.toEmployeePageForCompanyResponseDTO(foundEmployee);

        return ResponseEntity.ok().body(employeePageForCompanyResponseDTO);

    }


    @GetMapping("/workhours")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<List<EmployeeWorkingHoursResponseDTO>> getEmployeeWorkhourData()
    {
        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        List<EmployeeWorkingHours> workingHours = foundEmployee.getWorkingHours();

        List<EmployeeWorkingHoursResponseDTO> dto = workingHours.stream().map((workingHour -> EmployeeWorkingHoursMapper.toEmployeeWorkingHoursResponseDTO(workingHour))).toList();

        return ResponseEntity.ok(dto);

    }


    @DeleteMapping("/{employeeSlug}/delete-workhour/{workhourId}")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> deleteEmployeeWorkhour(@PathVariable String employeeSlug, @PathVariable Long workhourId)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        employeeWorkingHoursService.delete(workhourId, foundEmployee.getId());

        return ResponseEntity.ok().body("Esemény törölve");
    }

    @PutMapping("/{employeeSlug}/edit-workhour/{workhourId}")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public  ResponseEntity<String> editEmployeeWorkhour(@PathVariable String employeeSlug, @PathVariable Long workhourId, @RequestBody WorkhourEditDTO workhourEditDTO)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        employeeWorkingHoursService.edit(workhourId, workhourEditDTO.getSlotName(), foundEmployee, workhourEditDTO.getNewStart(), workhourEditDTO.getNewEnd());

        return ResponseEntity.ok().body("Esemény módosítva");
    }


    @PostMapping("/{employeeSlug}/create-workhour")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public  ResponseEntity<String> createEmployeeWorkhour(@PathVariable String employeeSlug, @RequestBody WorkhourAddDTO workhourAddDTO)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        employeeWorkingHoursService.createWorkhourForEmployee(foundEmployee, workhourAddDTO);

        return ResponseEntity.ok().body("Munkaidő létrehozva!");
    }

    @DeleteMapping("/{employeeSlug}/delete-workhours")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<String> deleteEmployeeWorkhours(@PathVariable String employeeSlug)
    {
        Long employeeId = employeeService.getEmployeeIdFromSlug(employeeSlug);
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        employeeWorkingHoursService.deleteWorkhoursForEmployee(foundEmployee);

        return ResponseEntity.ok().body("Munkaidők törölve!");
    }

    @GetMapping("/past-appointments-by-month")
    @PreAuthorize("hasAnyRole('EMPLOYEE')")
    public List<AppointmentsByDateResponseDTO> getEmployeePastAppointmentsByMonth()
    {
        return appointmentService.getEmployeeTotalAppointmentsByMonth(3);
    }

    @GetMapping("/section-cards-statistics")
    @PreAuthorize("hasAnyRole('EMPLOYEE')")
    public ResponseEntity<EmployeeSectionCardsResponseDTO> getEmployeeSectionCardsData()
    {
        Long authEmployeeId = SecurityUtils.getCurrentEmployeeId();

        Employee foundEmployee = employeeRepository.findById(authEmployeeId).orElseThrow(() -> new EmployeeNotFoundException(authEmployeeId.toString()));

        EmployeeSectionCardsResponseDTO responseDTO = employeeService.getEmployeeSectionCardsData(foundEmployee);

        return ResponseEntity.ok(responseDTO);

    }

    @PostMapping("/change-employee-details")
    @PreAuthorize("hasAnyRole('COMPANY','EMPLOYEE')")
    public ResponseEntity<EmployeeGetResponseDTO> changeEmployeeDetails(@Valid @RequestBody EmployeeDetailsChangeDTO employeeDetailsChangeDTO)
    {
        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeService.getEmployeeById(employeeId);

        EmployeeGetResponseDTO responseDTO = employeeService.changeEmployeeDetails(foundEmployee, employeeDetailsChangeDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadEmployeeAvatar(@RequestParam("avatar") MultipartFile file) {

        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeRepository.findById(employeeId).orElseThrow(() -> new UserNotFoundException(employeeId.toString()));

        try {
            // Ensure avatars directory exists
            Files.createDirectories(basePath);

            // Detect file extension safely
            String originalFilename = file.getOriginalFilename();
            String ext = getFileExtension(originalFilename);
            if (ext == null) {
                // fallback if user uploads without extension
                ext = "png";
            }

            // Generate unique filename
            String filename = UUID.randomUUID() + "." + ext;
            Path targetPath = basePath.resolve(filename);

            // Save the uploaded file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Build public URL
            String publicUrl =  frontendAddress +  "/avatar/user/" + filename;

            foundEmployee.setAvatarUrl(publicUrl);
            employeeRepository.save(foundEmployee);

            return ResponseEntity.ok(publicUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload avatar: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) return null;
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == filename.length() - 1) {
            return null;
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }

}
