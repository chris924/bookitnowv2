package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService implements UserDetailsService {


    private final IUserRepository userRepository;

    public UserAuthService(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("In the user details service");
        System.out.println(email);

        return userRepository.getUserByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user is not valid"));
    }


}