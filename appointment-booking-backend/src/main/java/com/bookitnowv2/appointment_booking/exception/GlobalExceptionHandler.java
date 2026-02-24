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
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex) {
        ErrorResponseDTO errorResponseDTO= new ErrorResponseDTO("GENERIC", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
    }

    //APPOINTMENT
    @ExceptionHandler(AppointmentNotFreeException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentNotFree(AppointmentNotFreeException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }


    //USER
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }




    //GENERIC
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(BadCredentialsException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO("BAD_CREDENTIALS", ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleRoleNotFoundException(RoleNotFoundException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(BadCredentialException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(BadCredentialException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(EmployeeNotActiveException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmployeeNotActiveException(EmployeeNotActiveException ex)
    {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }


}
