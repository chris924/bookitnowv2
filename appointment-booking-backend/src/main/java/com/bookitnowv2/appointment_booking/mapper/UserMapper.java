package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDataResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserDocument toDocument(User user)
    {
        return new UserDocument(
                user.getId(),
                user.getName(),
                user.getAvatarUrl());
    }

    public static UserDataResponseDTO toUserDataResponseDTO(User user)
    {
        return new UserDataResponseDTO(user.getId(), user.getName(), user.getUsername(), user.getEmail(), user.getAvatarUrl(), user.getCreatedAt());
    }

}
