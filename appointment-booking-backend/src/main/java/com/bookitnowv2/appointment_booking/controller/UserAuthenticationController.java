package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.service.UserAuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth/user")
public class UserAuthenticationController {

    private final UserAuthenticationService userAuthenticationService;


    public UserAuthenticationController(UserAuthenticationService userAuthenticationService)
    {
        this.userAuthenticationService = userAuthenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDTO body, @NotNull BindingResult bindingResult, HttpServletResponse servletResponse) {
        if (bindingResult.hasErrors()) {
            throw new BadCredentialsException("Invalid user login request body!");
        }
        UserLoginResponseDTO response = new UserLoginResponseDTO(body.getEmail());

        if (response.getEmail() == null) {
            throw new BadCredentialsException("Invalid user !");
        }

        String token = userAuthenticationService.loginUser(body.getEmail(), body.getPassword());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                // ! ONLY FOR LOCALHOST TESTING !
                .secure(false)
                // ! ONLY FOR LOCALHOST TESTING !
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
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

    @GetMapping("/me")
    public ResponseEntity<?> checkUserAuth(Authentication authentication)
    {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Not authenticated!");
        }

        User foundUser = (User) authentication.getPrincipal();

        Map<String, Object> userInfo = new HashMap<>();

        userInfo.put("id", foundUser.getId());
        userInfo.put("name", foundUser.getName());
        userInfo.put("email", foundUser.getEmail());

        return ResponseEntity.ok(userInfo);
    }

}
