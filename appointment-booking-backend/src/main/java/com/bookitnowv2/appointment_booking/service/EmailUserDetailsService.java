package com.bookitnowv2.appointment_booking.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.function.Function;

/**
 * Generic {@link UserDetailsService} that loads a principal by email from a repository.
 * <p>
 * Companies, employees and users live in separate tables and each have their own
 * {@code AuthenticationManager}, so this class is registered as a distinct bean per
 * principal type in {@code SecurityConfiguration} instead of being duplicated into
 * one near-identical class per type.
 */
public class EmailUserDetailsService implements UserDetailsService {

    private final Function<String, Optional<? extends UserDetails>> lookupByEmail;
    private final String principalType;

    public EmailUserDetailsService(Function<String, Optional<? extends UserDetails>> lookupByEmail, String principalType) {
        this.lookupByEmail = lookupByEmail;
        this.principalType = principalType;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return lookupByEmail.apply(email)
                .orElseThrow(() -> new UsernameNotFoundException(principalType + " is not valid"));
    }
}
