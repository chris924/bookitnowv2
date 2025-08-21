package com.bookitnowv2.appointment_booking.exception.appointment;

public class AppointmentNotFreeException extends RuntimeException {
    private final String code = "APPOINTMENT_NOT_FREE";

  public AppointmentNotFreeException(String message) {
    super(message);
  }
  public String getCode()
  {
    return this.code;
  }

}
