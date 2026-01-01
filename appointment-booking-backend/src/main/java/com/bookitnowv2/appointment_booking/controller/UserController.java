package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticUserRepository;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticUserService;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDataResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDetailsChangeDTO;
import com.bookitnowv2.appointment_booking.exception.UserNotFoundException;
import com.bookitnowv2.appointment_booking.mapper.UserMapper;
import com.bookitnowv2.appointment_booking.repository.IUserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {


    private final Path basePath;
    private final String frontendAddress;
    private final ElasticUserService elasticUserService;
    private final IElasticUserRepository elasticUserRepository;
    private final IUserRepository userRepository;

    public UserController(@Value("${avatar.user.directory.path}") String basePath,
                          @Value("${frontend.ip.address}") String frontendAddress,
                          ElasticUserService elasticUserService,
                          IUserRepository userRepository,
                          IElasticUserRepository elasticUserRepository) {

        this.basePath = Paths.get(basePath);
        this.frontendAddress = frontendAddress;
        this.elasticUserService = elasticUserService;
        this.elasticUserRepository = elasticUserRepository;
        this.userRepository = userRepository;
    }


    @GetMapping("/user-data")
    public ResponseEntity<UserDataResponseDTO> getUserData() {

        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));
        return ResponseEntity.ok(UserMapper.toUserDataResponseDTO(foundUser));

    }

    @PostMapping("/change-user-details")
    public ResponseEntity<UserDataResponseDTO> changeUserDetails(@Valid @RequestBody UserDetailsChangeDTO userDetailsChangeDTO)
    {
        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));

        boolean changedData = false;
        if(!userDetailsChangeDTO.getName().isEmpty())
        {
            foundUser.setName(userDetailsChangeDTO.getName());
            changedData = true;
        }
        if(!userDetailsChangeDTO.getUsername().isEmpty())
        {
            foundUser.setUsername(userDetailsChangeDTO.getUsername());
            changedData = true;
        }
        if(changedData)
        {
            userRepository.save(foundUser);
            elasticUserRepository.save(UserMapper.toDocument(foundUser));
        }
        return ResponseEntity.ok(UserMapper.toUserDataResponseDTO(foundUser));
    }


    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadUserAvatar(@RequestParam("avatar") MultipartFile file) {

        Long authUserId = SecurityUtils.getCurrentUserId();
        User foundUser = userRepository.findById(authUserId).orElseThrow(() -> new UserNotFoundException(authUserId.toString()));
        UserDocument userDocument = elasticUserService.getUserDocument(foundUser);

        try {
            // Ensure avatars directory exists
            Files.createDirectories(basePath);

            // Detect file extension safely
            String originalFilename = file.getOriginalFilename();
            String ext = getFileExtension(originalFilename);
            if (ext == null) {
                // fallback if user uploads without extension
                ext = "png";
            }

            // Generate unique filename
            String filename = UUID.randomUUID() + "." + ext;
            Path targetPath = basePath.resolve(filename);

            // Save the uploaded file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Build public URL
            String publicUrl =  frontendAddress +  "/avatar/user/" + filename;

            // Update DB + Elastic
            foundUser.setAvatarUrl(publicUrl);
            userDocument.setAvatarUrl(publicUrl);
            userRepository.save(foundUser);
            elasticUserRepository.save(userDocument);

            return ResponseEntity.ok(publicUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload avatar: " + e.getMessage());
        }
    }


    private String getFileExtension(String filename) {
        if (filename == null) return null;
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == filename.length() - 1) {
            return null; // no extension
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }


}
