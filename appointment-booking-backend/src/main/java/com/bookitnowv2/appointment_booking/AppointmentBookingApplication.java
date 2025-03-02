package com.bookitnowv2.appointment_booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.bookitnowv2.appointment_booking.repository")
public class AppointmentBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppointmentBookingApplication.class, args);
	}



}
