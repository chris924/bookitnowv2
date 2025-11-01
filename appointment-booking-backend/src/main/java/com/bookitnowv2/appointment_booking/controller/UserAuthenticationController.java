package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.Employee;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.AuthInfoResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.service.UserAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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
    public ResponseEntity<UserLoginResponseDTO> loginUser(@Valid @RequestBody LoginDTO body, @NotNull BindingResult bindingResult, HttpServletResponse servletResponse) {
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
                .secure(false) //TODO: Change in the future
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
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO body, @NotNull BindingResult bindingResult)
    {
        if (bindingResult.hasErrors())
        {
            throw new BadCredentialsException("Invalid user register request body!");
        }

        UserRegistrationResponseDTO response = userAuthenticationService.registerUser(body.getName(), body.getUsername(), body.getEmail(), body.getPassword());

        return ResponseEntity.ok(response);

    }

    @PostMapping("/logout")
    @Transactional //TODO: Add Redis blacklist JWT for more security?
    public ResponseEntity<String> logoutUser(Authentication authentication, HttpServletRequest request, HttpServletResponse response)
    {
        User foundUser = SecurityUtils.getCurrentUser();

        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        new SecurityContextLogoutHandler().logout(request, response, authentication);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)          // only send over HTTPS TODO: use true here
                .path("/")
                .maxAge(0)             // expire immediately
                .sameSite("Strict")    // prevents CSRF-like attacks
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");

    }

}
