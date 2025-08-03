package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.entity.ServiceEntity;
import com.bookitnowv2.appointment_booking.entity.dto.service.ServiceGetResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public ServiceGetResponseDTO toGetDTO(ServiceEntity serviceEntity)
    {
        return new ServiceGetResponseDTO(serviceEntity.getId(), serviceEntity.getName(), serviceEntity.getDescription(), serviceEntity.getPrice(), serviceEntity.getDuration());
    }

}
