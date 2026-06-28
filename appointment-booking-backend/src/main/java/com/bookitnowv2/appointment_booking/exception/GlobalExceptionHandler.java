package com.bookitnowv2.appointment_booking.exception;

import com.bookitnowv2.appointment_booking.entity.dto.error.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO("GENERIC", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
    }

    // NOT FOUND

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmployeeNotFound(EmployeeNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(CompanyNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleCompanyNotFound(CompanyNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentNotFound(AppointmentNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(ServiceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleServiceNotFound(ServiceNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(WorkingHourNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleWorkingHourNotFound(WorkingHourNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleRoleNotFound(RoleNotFoundException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    // APPOINTMENT

    @ExceptionHandler(AppointmentNotFreeException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentNotFree(AppointmentNotFreeException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(AppointmentNotBookedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentNotBooked(AppointmentNotBookedException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(AppointmentOverlapException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentOverlap(AppointmentOverlapException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponseDTO);
    }

    // ACCESS DENIED

    @ExceptionHandler(AppointmentAccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAppointmentAccessDenied(AppointmentAccessDeniedException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponseDTO);
    }

    @ExceptionHandler(ServiceAccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleServiceAccessDenied(ServiceAccessDeniedException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponseDTO);
    }

    @ExceptionHandler(WorkingHourAccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleWorkingHourAccessDenied(WorkingHourAccessDeniedException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponseDTO);
    }

    @ExceptionHandler(EmployeeNotActiveException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmployeeNotActive(EmployeeNotActiveException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponseDTO);
    }

    // AUTH

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleSpringBadCredentials(BadCredentialsException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO("BAD_CREDENTIALS", ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(BadCredentialException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredential(BadCredentialException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
    }

    @ExceptionHandler(NotAuthenticatedException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotAuthenticated(NotAuthenticatedException ex) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(ex.getCode(), ex.getMessage(), HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO);
    }
}
