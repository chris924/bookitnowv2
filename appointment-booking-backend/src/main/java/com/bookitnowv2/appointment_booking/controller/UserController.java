package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.elasticSearch.document.UserDocument;
import com.bookitnowv2.appointment_booking.elasticSearch.repository.IElasticUserRepository;
import com.bookitnowv2.appointment_booking.elasticSearch.service.ElasticUserService;
import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDataResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.user.UserDetailsChangeDTO;
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


    @GetMapping("/{userSlug}")
    public ResponseEntity<UserDataResponseDTO> getUserDataFromId(@PathVariable String userSlug) {
       // Integer userId = SlugExtractor.getIdFromSlug(userSlug);
      //  User foundUser = userService.getUserById(userId);
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(UserMapper.toUserDataResponseDTO(currentUser));

    }

    @PostMapping("/change-user-details")
    public ResponseEntity<UserDataResponseDTO> changeUserDetails(@Valid @RequestBody UserDetailsChangeDTO userDetailsChangeDTO)
    {
        User currentUser = SecurityUtils.getCurrentUser();

        boolean changedData = false;
        if(!userDetailsChangeDTO.getName().isEmpty())
        {
            currentUser.setName(userDetailsChangeDTO.getName());
            changedData = true;
        }
        if(!userDetailsChangeDTO.getUsername().isEmpty())
        {
            currentUser.setUsername(userDetailsChangeDTO.getUsername());
            changedData = true;
        }
        if(changedData)
        {
            userRepository.save(currentUser);
            elasticUserRepository.save(UserMapper.toDocument(currentUser));
        }
        return ResponseEntity.ok(UserMapper.toUserDataResponseDTO(currentUser));
    }


    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadUserAvatar(@RequestParam("avatar") MultipartFile file) {

        User currentUser = SecurityUtils.getCurrentUser();
        UserDocument userDocument = elasticUserService.getUserDocument(currentUser);

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
            currentUser.setAvatarUrl(publicUrl);
            userDocument.setAvatarUrl(publicUrl);
            userRepository.save(currentUser);
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
