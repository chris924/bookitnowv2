package com.bookitnowv2.appointment_booking.controller;

import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    private final Path avatarBasePath;

    public AvatarController(@Value("${avatar.directory.path}") String basePath) {
        this.avatarBasePath = Paths.get(basePath);
    }

    @GetMapping("/employee/{filename}")
    public ResponseEntity<?> getEmployeeAvatar(@PathVariable String filename) {
        return serveAvatar(avatarBasePath.resolve("employeeavatars").resolve(filename));
    }

    @GetMapping("/user/{filename}")
    public ResponseEntity<?> getUserAvatar(@PathVariable String filename) {
        return serveAvatar(avatarBasePath.resolve("useravatars").resolve(filename));
    }

    private ResponseEntity<?> serveAvatar(Path avatarPath) {
        try {
            UrlResource resource = new UrlResource(avatarPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return serveDefaultAvatar();
            }

            String mimeType = Files.probeContentType(avatarPath);
            if (mimeType == null) {
                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
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

    private ResponseEntity<?> serveDefaultAvatar() throws IOException {
        Path defaultAvatarPath = avatarBasePath.resolve("default-avatar.jpg");
        UrlResource defaultResource = new UrlResource(defaultAvatarPath.toUri());

        if (!defaultResource.exists() || !defaultResource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String mimeType = Files.probeContentType(defaultAvatarPath);
        if (mimeType == null) {
            mimeType = MediaType.IMAGE_JPEG_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .body(defaultResource);
    }
}
