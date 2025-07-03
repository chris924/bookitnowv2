package com.bookitnowv2.appointment_booking.service;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public TokenService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder)
    {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public String generateJwt(Authentication auth, Integer id)
    {
        Instant now = Instant.now();
        Duration validityDuration = Duration.ofMinutes(30);
        Instant expirationTime = now.plus(validityDuration);

        String scope = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .subject(String.valueOf(id))
                .expiresAt(expirationTime)
                .claim("roles", scope)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public Jwt decodeJwt(String jwt)
    {
        return jwtDecoder.decode(jwt);
    }

    public Boolean isTokenValid(Jwt jwt)
    {
        return jwt.getExpiresAt() != null && jwt.getExpiresAt().isAfter(Instant.now());
    }

}
