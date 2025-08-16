package com.bookitnowv2.appointment_booking.service;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.repository.IServiceEntityRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceEntityService {

    private final IServiceEntityRepository serviceEntityRepository;

    public ServiceEntityService(IServiceEntityRepository serviceEntityRepository)
    {
        this.serviceEntityRepository = serviceEntityRepository;
    }

    public ServiceEntity getServiceEntityById(Integer serviceId)
    {
        return serviceEntityRepository.findById(serviceId).orElseThrow(() -> new RuntimeException("Service entity not found")); //TODO: REFACTOR EXCEPTION
    }
}
