package com.bookitnowv2.appointment_booking.controller;

import jakarta.annotation.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    private final Path avatarBasePath = Paths.get("appointment-booking-backend/uploads/avatars"); //TODO: Refactor with application.properties


    @GetMapping("/employee/{filename}")
    public ResponseEntity<?> getEmployeeAvatar(@PathVariable String filename)
    {
        Path avatarPath = avatarBasePath.resolve("employeeavatars").resolve(filename);
        UrlResource resource;
        try {
             resource = new UrlResource(avatarPath.toUri());

             if(!resource.exists() || !resource.isReadable())
             {
                 return ResponseEntity.notFound().build();
             }

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
    }

}
