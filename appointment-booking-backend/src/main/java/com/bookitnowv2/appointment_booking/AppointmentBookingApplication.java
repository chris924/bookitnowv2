package com.bookitnowv2.appointment_booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class AppointmentBookingApplication {

	public static void main(String[] args) {
		Dotenv.load();
		SpringApplication.run(AppointmentBookingApplication.class, args);
	}



}
