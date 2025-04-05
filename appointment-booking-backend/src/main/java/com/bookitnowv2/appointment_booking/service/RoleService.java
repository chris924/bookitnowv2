package com.bookitnowv2.appointment_booking.service;


import com.bookitnowv2.appointment_booking.entity.Role;
import com.bookitnowv2.appointment_booking.repository.IRoleRepository;
import com.bookitnowv2.appointment_booking.exception.RoleNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class RoleService {

    private final IRoleRepository roleRepository;

    public RoleService(IRoleRepository roleRepository)
    {
        this.roleRepository = roleRepository;
    }


    public Role findByAuthority(String role)
    {
       return roleRepository.findByAuthority(role).orElseThrow(() -> new RoleNotFoundException(role)); //
    }

}
