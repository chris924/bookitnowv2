package com.bookitnowv2.appointment_booking.controller;

import com.bookitnowv2.appointment_booking.configuration.SecurityUtils;
import com.bookitnowv2.appointment_booking.entity.Company;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanySectionCardsResponseDTO;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyUpdateDTO;
import com.bookitnowv2.appointment_booking.exception.CompanyNotFoundException;
import com.bookitnowv2.appointment_booking.repository.ICompanyRepository;
import com.bookitnowv2.appointment_booking.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;
    private final ICompanyRepository companyRepository;
    private final Path basePath;
    private final String frontendAddress;

    public CompanyController(CompanyService companyService, ICompanyRepository companyRepository,
                             @Value("${avatar.user.directory.path}") String basePath,
                             @Value("${frontend.ip.address}") String frontendAddress)
    {
        this.companyService = companyService;
        this.companyRepository = companyRepository;
        this.basePath = Paths.get(basePath);
        this.frontendAddress = frontendAddress;
    }

    @GetMapping("/section-cards-statistics")
    public CompanySectionCardsResponseDTO getCompanySectionCardsStatistics()
    {
        return companyService.getCompanySectionCardsData();
    }

    @PutMapping("/change-company-details")
    @PreAuthorize("hasAnyRole('COMPANY')")
    public ResponseEntity<CompanyGetResponseDTO> changeCompanyDetails(@Valid @RequestBody CompanyUpdateDTO companyUpdateDTO)
    {

        CompanyGetResponseDTO responseDTO =  companyService.updateCompany(companyUpdateDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/upload-avatar")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> uploadCompanyAvatar(@RequestParam("avatar") MultipartFile file) {

        Long companyId = SecurityUtils.getCurrentCompanyId();
        Company foundCompany = companyRepository.findById(companyId).orElseThrow(() -> new CompanyNotFoundException(companyId.toString()));

        try {
            Files.createDirectories(basePath);

            String originalFilename = file.getOriginalFilename();
            String ext = getFileExtension(originalFilename);
            if (ext == null) {
                ext = "png";
            }

            String filename = UUID.randomUUID() + "." + ext;
            Path targetPath = basePath.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = frontendAddress + "/avatar/user/" + filename;

            foundCompany.setAvatarUrl(publicUrl);
            companyRepository.save(foundCompany);

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
            return null;
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }

}
