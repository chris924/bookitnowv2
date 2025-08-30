package com.bookitnowv2.appointment_booking.controller;

import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    private final Path avatarBasePath = Paths.get("appointment-booking-backend/uploads/avatars"); //TODO: Refactor with application.properties


    @GetMapping("/employee/{filename}")
    public ResponseEntity<?> getEmployeeAvatar(@PathVariable String filename) {
        Path avatarPath = avatarBasePath.resolve("employeeavatars").resolve(filename);

        try {
            UrlResource resource = new UrlResource(avatarPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Detect MIME type from file
            String mimeType = Files.probeContentType(avatarPath);
            if (mimeType == null) {
                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // fallback
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{filename}")
    public ResponseEntity<?> getUserAvatar(@PathVariable String filename) {
        Path avatarPath = avatarBasePath.resolve("useravatars").resolve(filename);

        try {
            UrlResource resource = new UrlResource(avatarPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Detect MIME type from file
            String mimeType = Files.probeContentType(avatarPath);
            if (mimeType == null) {
                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // fallback
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
