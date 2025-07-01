package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticUserService;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.service.UserAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/user/")
public class UserController {


    private final Path basePath;
    private final ElasticUserService elasticUserService;

    public UserController(@Value("${avatar.user.directory.path}") String basePath, ElasticUserService elasticUserService)
    {
        this.basePath = Paths.get(basePath);
        this.elasticUserService = elasticUserService;
    }

    @PostMapping("/user/upload-avatar")
    public ResponseEntity<String> uploadUserAvatar(@RequestParam("file") MultipartFile file)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        UserDocument userDocument = elasticUserService.getUserDocument(currentUser);

        String ext = getFileExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;

        try {

            Path targetPath = basePath.resolve(filename);
            Files.createDirectories(basePath);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/avatars/useravatars/" + filename;

            currentUser.setAvatarUrl(publicUrl);
            userDocument.setAvatarUrl(publicUrl);

            return ResponseEntity.ok(publicUrl);


        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }


    private String getFileExtension(String filename) {
        if (filename == null) return "jpg";
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex > 0) ? filename.substring(dotIndex + 1) : "jpg";
    }

}
