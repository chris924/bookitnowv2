package com.bookitnowv2.appointment_booking.utils;

import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookieUtils {

    private CookieUtils() {}

    public static ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();
    }

    public static ResponseCookie createExpiredJwtCookie() {
        return ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
    }
}
