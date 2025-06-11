package com.bookitnowv2.appointment_booking.mapper;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.entity.User;

public class UserMapper {

    public UserDocument toDocument(User user)
    {
        return new UserDocument(
                user.getId(),
                user.getName());
    }

}
