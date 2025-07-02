package com.bookitnowv2.appointment_booking.data;

import com.bookitnowv2.appointment_booking.elasticSearch.document.EmployeeDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticEmployeeRepository;
import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.mapper.EmployeeMapper;
import com.bookitnowv2.appointment_booking.repository.IAppointmentRepository;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.entity.*;
import com.bookitnowv2.appointment_booking.repository.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
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

    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final IElasticEmployeeRepository elasticEmployeeRepository;
    private final EmployeeMapper employeeMapper;

    private final String avatarDirectory;

    public DatabaseSeeder(IAppointmentRepository appointmentRepository, ICompanyRepository companyRepository, IRoleRepository roleRepository, IUserRepository userRepository, PasswordEncoder passwordEncoder, @Value("${avatar.directory.path}") String avatarDirectory,
                          IServiceEntityRepository serviceRepository, IEmployeeRepository employeeRepository, IElasticEmployeeRepository elasticEmployeeRepository, EmployeeMapper employeeMapper) {
        this.appointmentRepository = appointmentRepository;
        this.companyRepository = companyRepository;

        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.avatarDirectory = avatarDirectory;
        this.elasticEmployeeRepository = elasticEmployeeRepository;
        this.employeeMapper = employeeMapper;
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
        elasticEmployeeRepository.deleteAll();
        deleteAvatarDirectoryContents();

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
       User user2 = createUser("Alice Smith", "alice.smith", "alice.smith@email.com", "securePass", new Timestamp(System.currentTimeMillis()), new ArrayList<>(), userRoles);
       User user3 = createUser("Bob Johnson", "bob.johnson", "bob.johnson@email.com", "qwerty", new Timestamp(System.currentTimeMillis()), new ArrayList<>(), userRoles);


        Set<Role> companyRoles = new HashSet<>();
        companyRoles.add(roleRepository.findByAuthority("COMPANY").orElseThrow(() -> new RuntimeException("COMPANY role not found")));


      Company company1 = createCompany("Car Detailing", "cardetailing@gmail.com", "password", "We work with cars with passion", "Car detailing", "We detail and customize your car!", companyRoles, "Budapest");
      Company company2 = createCompany("IT Solutions", "itsolutions@gmail.com", "password", "Providing cutting-edge IT solutions", "IT Services", "Customized IT solutions for your business", companyRoles, "Pécs");
      Company company3 = createCompany("Home Cleaning", "homecleaning@gmail.com", "password", "Your trusted partner in home cleaning", "Home Cleaning", "We make your home shine!", companyRoles, "Szolnok");


      createAppointment(company1, 1);
        createAppointment(company1, 2);
      createAppointment(company2, 1);
        createAppointment(company2, 2);
      createAppointment(company3, 1);
        createAppointment(company3, 2);

        Set<Role> employeeRoles = new HashSet<>();
        employeeRoles.add(roleRepository.findByAuthority("EMPLOYEE").orElseThrow(() -> new RuntimeException("EMPLOYEE role not found")));


        Employee employee1 = createEmployee("John David", "jdavid", "jdavid@gmail.com", "jdavidpass", new Timestamp(System.currentTimeMillis()), employeeRoles, company1, 4.5, "http://localhost:8080/avatar/employee/default-avatar.jpg");

        ServiceEntity service1 = createService("Shave", "Shaving", (long) 15.0, employee1, company1);

        Set<ServiceEntity> serviceSet = new HashSet<>();
        serviceSet.add(service1);

        employee1.setServices(serviceSet);
    }


    @NotNull
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

        return user;
    }

    @NotNull
    private Employee createEmployee(String name, String username, String email, String password, Timestamp createdAt, Set<Role> roles, Company company, Double rating, String avatarUrl)
    {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setUsername(username);
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(password));
        employee.setAuthorities(roles);
        employee.setServices(new HashSet<>());
        employee.setCompany(company);
        employee.setRating(rating);
        employee.setAvatarUrl(avatarUrl); // TODO: Refactor localhost here?

        employeeRepository.save(employee);

        EmployeeDocument employeeDocument = employeeMapper.toDocument(employee);

        elasticEmployeeRepository.save(employeeDocument);

        return employee;
    }

    private ServiceEntity createService(String name, String description, Long price, Employee employee, Company company)
    {
        ServiceEntity service = new ServiceEntity();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setEmployee(employee);
        service.setCompany(company);

        serviceRepository.save(service);

        return service;
    }



    private Company createCompany(String companyName, String email, String password, String description, String serviceName, String serviceDescription, Set<Role> roles, String place) {

        Company company = new Company();
        company.setCompanyName(companyName);
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

    private void createAppointment(Company company, Integer plusDay) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime nextDay8AM = currentDateTime.plusDays(plusDay).withHour(8).withMinute(0).withSecond(0).withNano(0);


        DayOfWeek dayOfWeek = nextDay8AM.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            nextDay8AM = nextDay8AM.plusDays(2); // Move to Monday
        }

        Timestamp timestamp = Timestamp.valueOf(nextDay8AM);

        Appointment appointment = new Appointment();

        appointment.setCompany(company);
        appointment.setDateAndTime(timestamp);

        appointmentRepository.save(appointment);
        companyRepository.save(company);
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

    private void deleteAvatarDirectoryContents() {
        try {
            Path avatarDirectoryPath = Paths.get(avatarDirectory);
            Files.list(avatarDirectoryPath)
                    .forEach(file -> {
                        try {
                            Files.delete(file);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}