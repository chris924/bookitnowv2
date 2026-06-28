package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.auth.LoginDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserLoginResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserRegistrationResponseDTO;
import com.bookitnowv2.appointment_booking.exception.BadCredentialException;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import com.bookitnowv2.appointment_booking.service.UserAuthenticationService;
import com.bookitnowv2.appointment_booking.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth/user")
public class UserAuthenticationController {

    private final UserAuthenticationService userAuthenticationService;
    private final IUserRepository userRepository;

    public UserAuthenticationController(UserAuthenticationService userAuthenticationService, IUserRepository userRepository)
    {
        this.userAuthenticationService = userAuthenticationService;
        this.userRepository = userRepository;
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

        try{
            String token = userAuthenticationService.loginUser(body.getEmail(), body.getPassword());

            ResponseCookie cookie = CookieUtils.createJwtCookie(token);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);

        }catch (Exception e)
        {
            throw new BadCredentialException("Rossz felhasználónév vagy jelszó!");
        }
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
    @Transactional
    public ResponseEntity<String> logoutUser(Authentication authentication, HttpServletRequest request, HttpServletResponse response)
    {
        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));

        if(authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.notFound().build();

        new SecurityContextLogoutHandler().logout(request, response, authentication);

        ResponseCookie jwtCookie = CookieUtils.createExpiredJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");

    }

}
