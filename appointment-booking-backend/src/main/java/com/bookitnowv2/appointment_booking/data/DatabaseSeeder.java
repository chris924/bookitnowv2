package com.bookitnowv2.appointment_booking.data;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticUserRepository;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.mapper.UserMapper;
import com.bookitnowv2.appointment_booking.repository.IAppointmentRepository;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.repository.*;
import com.bookitnowv2.appointment_booking.service.AppointmentService;
import com.bookitnowv2.appointment_booking.utils.AppointmentStatus;
import com.bookitnowv2.appointment_booking.utils.EmployeeExperience;
import com.bookitnowv2.appointment_booking.utils.EmployeeStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final IUserRepository userRepository;
    private final IServiceEntityRepository serviceRepository;
    private final IEmployeeRepository employeeRepository;

    private final ICompanyRepository companyRepository;
    private final IAppointmentRepository appointmentRepository;
    private final IEmployeeWorkingHoursRepository employeeWorkingHoursRepository;

    private final AppointmentService appointmentService;

    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final IElasticEmployeeRepository elasticEmployeeRepository;
    private final IElasticUserRepository elasticUserRepository;
    private final EmployeeMapper employeeMapper;
    private final UserMapper userMapper;
    private final String serverAddress;

    public DatabaseSeeder(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IRoleRepository roleRepository, IUserRepository userRepository, PasswordEncoder passwordEncoder,
                          IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository, IElasticEmployeeRepository elasticEmployeeRepository, IEmployeeWorkingHoursRepository employeeWorkingHoursRepository, EmployeeMapper employeeMapper, @Value("${frontend.ip.address}") String serverAddress, AppointmentService appointmentService,
                          IElasticUserRepository elasticUserRepository, UserMapper userMapper) {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;

        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.elasticEmployeeRepository = elasticEmployeeRepository;
        this.elasticUserRepository = elasticUserRepository;
        this.employeeWorkingHoursRepository = employeeWorkingHoursRepository;
        this.employeeMapper = employeeMapper;
        this.userMapper = userMapper;
        this.serverAddress = serverAddress;

        this.appointmentService = appointmentService;
    }

    @Override
    public void run(String... args) {

        resetDatabase();

    }

    private void resetDatabase() {
        appointmentRepository.deleteAll();
        userRepository.deleteAll();
        serviceRepository.deleteAll();
        employeeRepository.deleteAll();
        companyRepository.deleteAll();
        roleRepository.deleteAll();
        employeeWorkingHoursRepository.deleteAll();
        elasticEmployeeRepository.deleteAll();

        createRolesIfNotExists();
        createAdmin();
        createEntities();
    }


    private void createAdmin() {

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(roleRepository.findByAuthority("ADMIN").orElseThrow(() -> new RuntimeException("USER role not found")));

        User admin = new User();
        admin.setName("admin");
        admin.setUsername("admin");
        admin.setEmail("admin@admin.com");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        admin.setAuthorities(adminRoles);
        admin.setAppointments(new ArrayList<>());

        userRepository.save(admin);
    }




    private void createEntities() {
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(roleRepository.findByAuthority("USER").orElseThrow(() -> new RuntimeException("USER role not found")));

        User user1 = createUser("John Doe", "john.doe", "john.doe@email.com", "password123", new Timestamp(System.currentTimeMillis()), new ArrayList<>(), userRoles);
        createUser("Alice Smith", "alice.smith", "alice.smith@email.com", "securePass", new Timestamp(System.currentTimeMillis()), new ArrayList<>(), userRoles);
        createUser("Bob Johnson", "bob.johnson", "bob.johnson@email.com", "qwerty", new Timestamp(System.currentTimeMillis()), new ArrayList<>(), userRoles);


        Set<Role> companyRoles = new HashSet<>();
        companyRoles.add(roleRepository.findByAuthority("COMPANY").orElseThrow(() -> new RuntimeException("COMPANY role not found")));


        Company company1 = createCompany("Car Detailing", "cardetailing@gmail.com", "password", "We work with cars with passion", "Car detailing", "We detail and customize your car!", companyRoles, "Budapest");
        Company company2 = createCompany("IT Solutions", "itsolutions@gmail.com", "password", "Providing cutting-edge IT solutions", "IT Services", "Customized IT solutions for your business", companyRoles, "Pécs");
        Company company3 = createCompany("Home Cleaning", "homecleaning@gmail.com", "password", "Your trusted partner in home cleaning", "Home Cleaning", "We make your home shine!", companyRoles, "Szolnok");





        Set<Role> employeeRoles = new HashSet<>();
        employeeRoles.add(roleRepository.findByAuthority("EMPLOYEE").orElseThrow(() -> new RuntimeException("EMPLOYEE role not found")));


        Employee employee1 = createEmployee("John David", "jdavid", "jdavid@gmail.com", "password", new Timestamp(System.currentTimeMillis()), employeeRoles, company1, 4.9, serverAddress + "/avatar/employee/default-avatar.jpg", "This is the about section. This is the about section. This is the about section.", EmployeeStatus.ACTIVE, EmployeeExperience.JUNIOR, "+36304325674");
        Employee employee2 = createEmployee("John Mike", "dds", "dds@gmail.com", "jdavidpass", new Timestamp(System.currentTimeMillis()), employeeRoles, company1, 4.5, serverAddress + "/avatar/employee/default-avatar.jpg", "This is the about section. This is the about section. This is the about section.", EmployeeStatus.ACTIVE, EmployeeExperience.MASTER, "+36205435345");
        Employee employee3 = createEmployee("John XD", "sad", "edwdwd@gmail.com", "jdavidpass", new Timestamp(System.currentTimeMillis()), employeeRoles, company1, 4.5, serverAddress + "/avatar/employee/default-avatar.jpg", "This is the about section. This is the about section. This is the about section.", EmployeeStatus.ACTIVE, EmployeeExperience.SENIOR, "+363053422");

        List<EmployeeWorkingHours> employee1WorkingHoursList = new ArrayList<>();




        EmployeeWorkingHours employee1WorkingHours = createEmployeeWorkingHours(employee1, "TEST", LocalTime.of(8, 0), LocalTime.of(23, 0), LocalDate.now().plusDays(1) );



        employee1WorkingHoursList.add(employee1WorkingHours);


        ServiceEntity service1 = createService("Shave", "Shaving",  15, employee1, company1, Duration.ofMinutes(30));

        List<ServiceEntity> serviceList = new ArrayList<>();
        List<Appointment> appointmentList = new ArrayList<>();

        serviceList.add(service1);

        employee1.setServices(serviceList);
        employee1.setWorkingHours(employee1WorkingHoursList);

        employee2.setServices(serviceList);
        employee3.setServices(serviceList);

        LocalDate now = LocalDate.now();
        LocalDate yesterday = now.minusDays(1);
        LocalDate anotherDate = yesterday.minusDays(4);

        Appointment appointment1 = createAppointment( service1, LocalDate.now(), user1, LocalTime.of(9, 25), LocalTime.of(11, 10), AppointmentStatus.BOOKED, employee1WorkingHours);
        Appointment appointment2 = createAppointment( service1, yesterday, user1, LocalTime.of(9, 25), LocalTime.of(11, 10), AppointmentStatus.BOOKED, employee1WorkingHours);
        Appointment appointment3 = createAppointment( service1, yesterday, user1, LocalTime.of(13, 25), LocalTime.of(14, 10), AppointmentStatus.BOOKED, employee1WorkingHours);
        Appointment appointment4 = createAppointment( service1, yesterday, user1, LocalTime.of(14, 25), LocalTime.of(15, 10), AppointmentStatus.BOOKED, employee1WorkingHours);
        Appointment appointment5 = createAppointment( service1, anotherDate, user1, LocalTime.of(14, 25), LocalTime.of(15, 10), AppointmentStatus.BOOKED, employee1WorkingHours);


        appointmentList.add(appointment1);
        appointmentList.add(appointment2);
        appointmentList.add(appointment3);
        appointmentList.add(appointment4);
        appointmentList.add(appointment5);
        service1.setAppointments(appointmentList);

        appointmentService.createFreeAppointmentSlotsFromService(service1);
    }


    private User createUser(String name, String username, String email, String password, Timestamp createdAt, List<Appointment> appointments, Set<Role> roles) {

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(createdAt);
        user.setAuthorities(roles);
        user.setAppointments(appointments);

        userRepository.save(user);
        elasticUserRepository.save(userMapper.toDocument(user));

        return user;
    }

    @NotNull
    private Employee createEmployee(String name, String username, String email, String password, Timestamp createdAt, Set<Role> roles, Company company, Double rating, String avatarUrl, String about, EmployeeStatus status, EmployeeExperience experience, String phoneNumber) {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setUsername(username);
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(password));
        employee.setAuthorities(roles);
        employee.setServices(new ArrayList<>());
        employee.setCompany(company);
        employee.setRating(rating);
        employee.setCreatedAt(createdAt);
        employee.setAvatarUrl(avatarUrl);
        employee.setAbout(about);
        employee.setStatus(status);
        employee.setExperience(experience);
        employee.setPhoneNumber(phoneNumber);

        employeeRepository.save(employee);

        EmployeeDocument employeeDocument = employeeMapper.toDocument(employee);

        elasticEmployeeRepository.save(employeeDocument);

        return employee;
    }

    private ServiceEntity createService(String name, String description, Integer price, Employee employee, Company company, Duration duration) {
        ServiceEntity service = new ServiceEntity();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setEmployee(employee);
        service.setCompany(company);
        service.setDuration(duration);

        serviceRepository.save(service);

        return service;
    }


    private Company createCompany(String name, String email, String password, String description, String serviceName, String serviceDescription, Set<Role> roles, String place) {

        Company company = new Company();
        company.setName(name);
        company.setEmail(email);
        company.setPassword(passwordEncoder.encode(password));
        company.setAuthorities(roles);
        company.setDescription(description);
        company.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        company.setServiceName(serviceName);
        company.setServiceDescription(serviceDescription);
        company.setPlace(place);

        companyRepository.save(company);

        return company;
    }

    private Appointment createAppointment( ServiceEntity serviceEntity, LocalDate date, User user, LocalTime startTime, LocalTime endTime, AppointmentStatus status, EmployeeWorkingHours workingHours) {

        Appointment appointment = new Appointment();

        appointment.setService(serviceEntity);
        appointment.setUser(user);
        appointment.setDate(date);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setWorkingHours(workingHours);

        appointment.setAppointmentStatus(status);

        appointmentRepository.save(appointment);
    //   companyRepository.save(company);
        return appointment;
    }

    private EmployeeWorkingHours createEmployeeWorkingHours(Employee employee, String name, LocalTime startTime, LocalTime endTime, LocalDate date)
    {
        EmployeeWorkingHours employeeWorkingHours = new EmployeeWorkingHours();

        employeeWorkingHours.setEmployee(employee);
        employeeWorkingHours.setName(name);
        employeeWorkingHours.setStartTime(startTime);
        employeeWorkingHours.setEndTime(endTime);
        employeeWorkingHours.setDate(date);

        employeeWorkingHoursRepository.save(employeeWorkingHours);

        return employeeWorkingHours;

    }


    private void createRolesIfNotExists() {
        if (roleRepository.findByAuthority("COMPANY").isEmpty()) {
            Role companyRole = new Role("COMPANY");
            roleRepository.save(companyRole);
        }

        if (roleRepository.findByAuthority("EMPLOYEE").isEmpty()) {
            Role employeeRole = new Role("EMPLOYEE");
            roleRepository.save(employeeRole);
        }


        if (roleRepository.findByAuthority("USER").isEmpty()) {
            Role userRole = new Role("USER");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByAuthority("ADMIN").isEmpty()) {
            Role adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }
    }

}

