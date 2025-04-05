package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.service.UserAuthenticationService;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/auth/user")
@CrossOrigin("*")
public class UserAuthenticationController {

    private final UserAuthenticationService userAuthenticationService;


    public UserAuthenticationController(UserAuthenticationService userAuthenticationService)
    {
        this.userAuthenticationService = userAuthenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDTO body, @NotNull BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadCredentialsException("Invalid user login request body!");
        }

        UserLoginResponseDTO response = userAuthenticationService.loginUser(body.getEmail(), body.getPassword());

        if (response.getEmail() == null || Objects.equals(response.getJwt(), "")) {
            throw new BadCredentialsException("Invalid user !");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO body, @NotNull BindingResult bindingResult)
    {
        if (bindingResult.hasErrors())
        {
            throw new BadCredentialsException("Invalid user register request body!");
        }

        UserRegistrationResponseDTO response = userAuthenticationService.registerUser(body.getName(), body.getUsername(), body.getEmail(), body.getPassword());

        return ResponseEntity.ok(response);

    }

}
