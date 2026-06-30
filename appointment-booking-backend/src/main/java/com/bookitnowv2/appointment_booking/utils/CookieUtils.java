package com.bookitnowv2.appointment_booking.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtils {

    @Value("${app.cookie.secure:false}")
    private boolean secure;
    @Value("${app.cookie.same-site:Strict}")
    private String sameSite;

    public ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();
    }

    public ResponseCookie createExpiredJwtCookie() {
        return ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}
