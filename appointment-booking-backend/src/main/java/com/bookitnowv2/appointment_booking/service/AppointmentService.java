package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.AppointmentSlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.appointment.SlotResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.AppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentTableDataResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.employee.EmployeeAppointmentsByDateResponseDTO;
import com.bookitnowv2.appointment_booking.exception.*;
import com.bookitnowv2.appointment_booking.mapper.AppointmentMapper;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.*;
import java.util.*;

@Service
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final ICompanyRepository companyRepository;
    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeWorkingHoursRepository employeeWorkingHoursRepository;
    private final AppointmentMapper appointmentMapper;
    private final IEmployeeRepository employeeRepository;

    @Autowired
    AppointmentService(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IUserRepository userRepository, IServiceEntityRepository serviceRepository, IEmployeeWorkingHoursRepository employeeWorkingHoursRepository, AppointmentMapper appointmentMapper,
                       IEmployeeRepository employeeRepository)
    {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeWorkingHoursRepository = employeeWorkingHoursRepository;
        this.appointmentMapper = appointmentMapper;
        this.employeeRepository = employeeRepository;
    }

    public Appointment createAppointment(Long serviceId, Timestamp timestamp) {
        ServiceEntity foundService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service not found by Id: " + serviceId));

        Appointment newAppointment = createAppointmentFromService(foundService, timestamp);

        return appointmentRepository.save(newAppointment);
    }

    public List<AppointmentGetResponseDTO> getAppointments()
    {
        return appointmentRepository.findAll().stream().map((AppointmentMapper::toGetDTO)).toList();
    }

    public void deleteAppointmentById(Long id)
    {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new AppointmentNotFoundException(id.toString()));

        appointmentRepository.deleteById(id);
    }

    public Appointment getAppointmentById(Long appointmentId)
    {
        return appointmentRepository.findById(appointmentId).orElseThrow(() -> new AppointmentNotFoundException(appointmentId.toString()));
    }

    public AppointmentGetResponseDTO employeeGetAppointmentDetailsById(Long appointmentId)
    {
        Long authEmployeeId = SecurityUtils.getCurrentEmployeeId();

        Employee foundEmployee = employeeRepository.findById(authEmployeeId).orElseThrow(() -> new EmployeeNotFoundException(authEmployeeId.toString()));

        Appointment foundAppointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new AppointmentNotFoundException(appointmentId.toString()));

        if(foundAppointment.getService().getEmployee() != foundEmployee)
        {
            throw new AppointmentAccessDeniedException("Nem a te foglalásod!");
        }

        return AppointmentMapper.toGetDTO(foundAppointment);

    }


    public void addUserToAppointment(Appointment appointment, User user)
    {
        if(appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)
        {
            throw new AppointmentNotFreeException("Az időpont már foglalt.");
        }

        List<Appointment> userAppointments =  user.getAppointments();

        for (Appointment app : userAppointments) {
            if (appointment.getStartTime().isBefore(app.getEndTime()) &&
                    appointment.getEndTime().isAfter(app.getStartTime()) && app.getAppointmentStatus() == AppointmentStatus.BOOKED) {
                throw new AppointmentOverlapException("Az időpont ütközik egy már lefoglalt időponttal.");
            }
        }

        appointment.setUser(user);
        appointment.setAppointmentStatus(AppointmentStatus.BOOKED);
        user.getAppointments().add(appointment);

        LocalDate userFirstBookingDate = user.getFirstBookingDate();
        if(userFirstBookingDate == null)
        {
            user.setFirstBookingDate(appointment.getDate());
        }


        appointmentRepository.save(appointment);
        userRepository.save(user);
    }

    public void deleteUserFromAppointment(Long id)
    {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new AppointmentNotFoundException(id.toString()));

        foundAppointment.setUser(null);
        appointmentRepository.save(foundAppointment);
    }



    private static @NotNull Appointment createAppointmentFromService(ServiceEntity foundService, Timestamp timestamp) {
        Company foundCompany = foundService.getCompany();
        Employee foundEmployee = foundService.getEmployee();

        if (foundCompany == null) throw new CompanyNotFoundException("Company not found for service!");
        if (foundEmployee == null) throw new EmployeeNotFoundException("Employee not found for service!");

        Appointment newAppointment = new Appointment();
        newAppointment.setService(foundService);


        return newAppointment;
    }

    @Transactional
    public void rateAppointment(Long appointmentId, Integer rating, Long userId)
    {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId.toString()));

        if (appointment.getUser() == null || !appointment.getUser().getId().equals(userId)) {
            throw new AppointmentAccessDeniedException("Nem a te foglalásod!");
        }

        if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {
            throw new AppointmentNotBookedException("Csak lefoglalt időpontot lehet értékelni!");
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Az értékelés 1 és 5 közötti szám kell legyen!");
        }

        appointment.setRating(rating);
        appointmentRepository.save(appointment);

        Employee employee = appointment.getService().getEmployee();
        recalculateEmployeeRating(employee);
    }

    private void recalculateEmployeeRating(Employee employee)
    {
        List<Appointment> allAppointments = employee.getAppointments();
        double avgRating = allAppointments.stream()
                .filter(a -> a.getRating() != null)
                .mapToInt(Appointment::getRating)
                .average()
                .orElse(0.0);

        employee.setRating(Math.round(avgRating * 10.0) / 10.0);
        employeeRepository.save(employee);
    }

    public void cancelBookedAppointment(Appointment appointment)
    {
        User appointmentUser = appointment.getUser();

        if(appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)
        {
            appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        }
        else
        {
            throw new AppointmentNotBookedException(appointment.getDate().toString());
        }

        if(appointmentUser.getFirstBookingDate() == appointment.getDate())
        {
            appointmentUser.setFirstBookingDate(null);
        }
        userRepository.save(appointmentUser);
        appointmentRepository.save(appointment);
    }

    public AppointmentSlotResponseDTO getAppointmentSlotsFromService(ServiceEntity serviceEntity)
    {
        AppointmentSlotResponseDTO appointmentSlotResponseDTO =  new AppointmentSlotResponseDTO();

        List<SlotResponseDTO> slotResponseDTOList = new ArrayList<>();

        appointmentSlotResponseDTO.setSlotResponseDTO(slotResponseDTOList);

        Employee employee = serviceEntity.getEmployee();

        if(employee.getStatus() == EmployeeStatus.NOT_ACTIVE)
        {
            throw new EmployeeNotActiveException("Alkalmazott nem aktív!");
        }

        List<EmployeeWorkingHours> employeeWorkingHours = employee.getWorkingHours();

        List<Appointment> existingAppointments = appointmentRepository.findUpcomingAppointments(serviceEntity.getId(), LocalDate.now(), LocalTime.now(), AppointmentStatus.FREE);

        LocalTime smallestStart = null;
        LocalTime largestEnd = null;
        LocalDate firstDate = null;
        LocalDate lastDate = null;

        for(Appointment x : existingAppointments)
        {
          EmployeeWorkingHours workingHours = x.getWorkingHours();



          if(x.getStartTime().isBefore(workingHours.getStartTime()) || x.getEndTime().isAfter(workingHours.getEndTime()))
          {
              continue;  // This needs, so if the workhour changes, existing appointments gets into Cancelled, so it will be free, but it should not be bookable if not in range
          }


           LocalTime dayStartTime = x.getStartTime();
           LocalTime dayEndTime = x.getEndTime();
           LocalDate workingHourDate = x.getDate();

            if (smallestStart == null || dayStartTime.isBefore(smallestStart)) smallestStart = dayStartTime;
            if (largestEnd == null || dayEndTime.isAfter(largestEnd)) largestEnd = dayEndTime;
            if (firstDate == null || workingHourDate.isBefore(firstDate)) firstDate = workingHourDate;
            if (lastDate == null || workingHourDate.isAfter(lastDate)) lastDate = workingHourDate;

            SlotResponseDTO slotResponseDTO = new SlotResponseDTO();

            slotResponseDTO.setId(x.getId());
            slotResponseDTO.setStart(dayStartTime);
            slotResponseDTO.setEnd(dayEndTime);
            slotResponseDTO.setDate(workingHourDate);
            switch (x.getAppointmentStatus()) {
                case FREE -> slotResponseDTO.setStatus("FREE");
                case BOOKED -> slotResponseDTO.setStatus("BOOKED");
                case CANCELLED -> slotResponseDTO.setStatus("CANCELLED");
            }

            slotResponseDTOList.add(slotResponseDTO);


        };

        appointmentSlotResponseDTO.setFirstHour(smallestStart);
        appointmentSlotResponseDTO.setLastHour(largestEnd);
        appointmentSlotResponseDTO.setFirstDate(firstDate);
        appointmentSlotResponseDTO.setLastDate(lastDate);
        return appointmentSlotResponseDTO;
    }

    public void createFreeAppointmentSlotsFromService(ServiceEntity serviceEntity) // This will be called to create free appointments
    {

        Employee employee = serviceEntity.getEmployee();
        List<EmployeeWorkingHours> employeeWorkingHours = employee.getWorkingHours();
        List<Appointment> existingAppointments = serviceEntity.getAppointments();

        LocalTime smallestStart = null;
        LocalTime largestEnd = null;
        LocalDate firstDate = null;
        LocalDate lastDate = null;

        for(EmployeeWorkingHours x : employeeWorkingHours)
        {


            LocalTime dayStartTime = x.getStartTime();
            LocalTime dayEndTime = x.getEndTime();
            LocalDate workingHourDate = x.getDate();

            if (smallestStart == null || dayStartTime.isBefore(smallestStart)) smallestStart = dayStartTime;
            if (largestEnd == null || dayEndTime.isAfter(largestEnd)) largestEnd = dayEndTime;
            if (firstDate == null || workingHourDate.isBefore(firstDate)) firstDate = workingHourDate;
            if (lastDate == null || workingHourDate.isAfter(lastDate)) lastDate = workingHourDate;

            Duration serviceDuration = serviceEntity.getDuration();

            LocalTime current = dayStartTime;


            List<Appointment> currentExistingAppointments= existingAppointments.stream().filter(z -> z.getDate().equals(workingHourDate)).toList();

            while (!current.plus(serviceDuration).isAfter(dayEndTime)) {
                LocalTime slotStart = current;
                LocalTime slotEnd = current.plus(serviceDuration);

                // Skip past slots for today
                if (workingHourDate.isBefore(LocalDate.now()) ||
                        (workingHourDate.isEqual(LocalDate.now()) && slotStart.isBefore(LocalTime.now()))) {
                    current = slotEnd;
                    continue;
                }


                // Find if there's a conflict
                Optional<Appointment> conflict = currentExistingAppointments.stream()
                        .filter(i -> slotStart.isBefore(i.getEndTime()) && slotEnd.isAfter(i.getStartTime()))
                        .min(Comparator.comparing(Appointment::getStartTime));

                SlotResponseDTO slotResponseDTO = new SlotResponseDTO();
                slotResponseDTO.setDate(workingHourDate);

                Appointment newAppointment =  new Appointment();

                newAppointment.setDate(x.getDate());
                newAppointment.setService(serviceEntity);

                if (conflict.isPresent()) {
                    Appointment appt = conflict.get();

                    current = appt.getEndTime();
                } else {
                    newAppointment.setStartTime(slotStart);
                    newAppointment.setEndTime(slotEnd);
                    newAppointment.setAppointmentStatus(AppointmentStatus.FREE);
                    newAppointment.setWorkingHours(x); // Workinghour is MANDATORY!
               //     x.getAppointments().add(newAppointment); <- DOES NOT NEEDED ??


                    appointmentRepository.save(newAppointment);

                    // move to next slot
                    current = slotEnd;
                }


            }

        };

    }

    public void deleteAppointmentsAfterWorkhourChange(ServiceEntity serviceEntity)
    {
        Employee employee = serviceEntity.getEmployee();
        List<EmployeeWorkingHours> employeeWorkingHours = employee.getWorkingHours();
        List<Appointment> existingAppointments = serviceEntity.getAppointments();

        for(EmployeeWorkingHours x : employeeWorkingHours) {

            LocalDate workingHourDate = x.getDate();

            List<Appointment> currentExistingAppointments = existingAppointments.stream().filter(z -> z.getDate().equals(workingHourDate)).toList();

            for(Appointment appointment : currentExistingAppointments)
            {
                if(x.getStartTime().isAfter(appointment.getStartTime()) || x.getEndTime().isBefore(appointment.getEndTime()))
                {
                    appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
                  //  appointmentRepository.delete(appointment);
                    appointmentRepository.save(appointment);
                }

            }
        }
    }


    public void deleteAppointmentsByWorkhour(Long employeeWorkingHourId, Long employeeId)
    {
       List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsForWorkingHour(employeeId, employeeWorkingHourId);

       appointmentRepository.deleteAll(appointments);

    }


    @Transactional
    public List<AppointmentsByDateResponseDTO> getCompanyTotalAppointmentsByMonth(Integer monthCount)
    {

        Long authCompanyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(authCompanyId).orElseThrow(() -> new CompanyNotFoundException(authCompanyId.toString()));

        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);

        return appointmentRepository.countCompanyTotalAppointmentsByDate(foundCompany.getId(), startDate, AppointmentStatus.BOOKED);
    }

    @Transactional
    public List<AppointmentsByDateResponseDTO> getEmployeeTotalAppointmentsByMonth(Integer monthCount)
    {
        Long authEmployeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeRepository.findById(authEmployeeId).orElseThrow(() -> new EmployeeNotFoundException(authEmployeeId.toString()));


        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);

        return appointmentRepository.countEmployeeTotalAppointmentsByDate(foundEmployee.getId(), startDate, AppointmentStatus.BOOKED);
    }

    public List<EmployeeAppointmentsByDateResponseDTO> getEmployeePreviousBookingsByMonth(Employee employee)
    {
        Long monthCount = 6L;
        LocalDate currentDate = LocalDate.now();

        LocalDate startDate = currentDate.minusMonths(monthCount);
        return appointmentRepository.getEmployeePreviousBookings(employee.getId(), startDate, AppointmentStatus.BOOKED);
    }


    @Transactional
    public List<EmployeeAppointmentTableDataResponseDTO> getEmployeeAppointmentsDataForTable()
    {
        Long authEmployeeId = SecurityUtils.getCurrentEmployeeId();
        Employee foundEmployee = employeeRepository.findById(authEmployeeId).orElseThrow(() -> new EmployeeNotFoundException(authEmployeeId.toString()));

        List<Appointment> employeeAppointments = foundEmployee.getAppointments().stream().filter((appointment -> appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)).toList();

        return employeeAppointments.stream().map((AppointmentMapper::toEmployeeAppointmentTableDataResponseDTO)).toList();

    }
}
