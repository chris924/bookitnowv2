package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.Appointment;
import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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


        @Autowired
        private IUserRepository userRepository;
        @Autowired
        private IRoleRepository roleRepository;
        @Autowired
        private PasswordEncoder passwordEncoder;

        @Qualifier("userAuthManager")
        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private TokenService tokenService;


        public UserRegistrationResponseDTO registerUser(String name, String username, String email, String password)
        {
            try {
                String encodedPassword = passwordEncoder.encode(password);
                Role userRole = roleRepository.findByAuthority("USER").get();


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

                userRepository.save(newUser);

                return new UserRegistrationResponseDTO(name, username, email);

            }catch (Exception e)
            {
                return new UserRegistrationResponseDTO("","","");
            }



        }

        public UserLoginResponseDTO loginUser(String email, String password)
        {
            try{

                Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
                String token = tokenService.generateJwt(auth, userRepository.getUserByEmail(email).get().getUserId());


                return new UserLoginResponseDTO(userRepository.getUserByEmail(email).get().getEmail(), token);

            }catch (AuthenticationException e) {
                return new UserLoginResponseDTO(null, "");
            }

        }
        public Integer getUserData(String jwt)
        {

            return Integer.valueOf(tokenService.decodeJwt(jwt).getSubject());
        }

    }
