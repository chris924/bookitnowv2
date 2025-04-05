package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.exception.RoleNotFoundException;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserAuthenticationService {


        private final UserService userService;
        private final RoleService roleService;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final TokenService tokenService;

        public UserAuthenticationService(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenService tokenService)
        {
            this.userService = userService;
            this.roleService =  roleService;
            this.passwordEncoder = passwordEncoder;
            this.authenticationManager = authenticationManager;
            this.tokenService = tokenService;
        }


        public UserRegistrationResponseDTO registerUser(String name, String username, String email, String password)
        {

                String encodedPassword = passwordEncoder.encode(password);
                Role userRole = roleService.findByAuthority("USER");

                Set<Role> authorities = new HashSet<>();
                List<Appointment> appointments = new ArrayList<>();

                authorities.add(userRole);
                User newUser = new User();
                newUser.setName(name);
                newUser.setUsername(username);
                newUser.setEmail(email);
                newUser.setPassword(encodedPassword);
                newUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                newUser.setAppointments(appointments);
                newUser.setAuthorities(authorities);

                User savedUser = userService.saveUser(newUser);
                return new UserRegistrationResponseDTO(savedUser.getName(), savedUser.getUsername(), savedUser.getEmail());

        }

        public UserLoginResponseDTO loginUser(String email, String password)
        {

            User user = userService.getUserByEmail(email);
            String userEmail = user.getEmail();

            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userEmail, password));

            String token = tokenService.generateJwt(auth, user.getUserId());

            return new UserLoginResponseDTO(userEmail, token);

        }

        public Integer getUserData(String jwt)
        {
            return Integer.valueOf(tokenService.decodeJwt(jwt).getSubject());
        }

    }
