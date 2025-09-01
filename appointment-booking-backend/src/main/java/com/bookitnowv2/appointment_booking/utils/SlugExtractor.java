package com.bookitnowv2.appointment_booking.utils;

import org.springframework.stereotype.Component;

@Component
public class SlugExtractor {

    public static Integer getIdFromSlug(String slug)
    {
        try {
            String[] parts = slug.split("-");
            String idPart = parts[parts.length - 1];
            return Integer.parseInt(idPart);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid slug format: " + slug);
        }
    }

}
