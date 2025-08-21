package com.bookitnowv2.appointment_booking.exception;

import com.bookitnowv2.appointment_booking.entity.dto.error.ErrorResponseDTO;
import com.bookitnowv2.appointment_booking.exception.appointment.AppointmentNotFreeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong: " + ex.getMessage());
    }

    //APPOINTMENT
    @ExceptionHandler(AppointmentNotFreeException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentNotFree(AppointmentNotFreeException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }



    //TODO: Refactor these exceptions aswell
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentialsException(BadCredentialsException ex)
    {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad credentials: " + ex.getMessage());
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<String> handleRoleNotFoundException(RoleNotFoundException ex)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

}
