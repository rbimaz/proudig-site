package de.proudig.site.service;

import de.proudig.site.config.FileStorageProperties;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(FileStorageService.class);
    private final FileStorageProperties fileStorageProperties;

    public void init() {
        try {
            Path uploadPath = Paths.get(fileStorageProperties.getLocation());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath);
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory", e);
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String store(MultipartFile file, String subDir) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(fileStorageProperties.getLocation());
            if (subDir != null && !subDir.isEmpty()) {
                uploadPath = uploadPath.resolve(subDir);
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            log.info("Stored file: {}", filePath);
            return filename;
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public Resource load(String filename, String subDir) {
        try {
            Path uploadPath = Paths.get(fileStorageProperties.getLocation());
            if (subDir != null && !subDir.isEmpty()) {
                uploadPath = uploadPath.resolve(subDir);
            }
            Path filePath = uploadPath.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + filename);
            }
        } catch (Exception e) {
            log.error("Failed to load file", e);
            throw new RuntimeException("Failed to load file", e);
        }
    }

    public boolean delete(String filename, String subDir) {
        try {
            Path uploadPath = Paths.get(fileStorageProperties.getLocation());
            if (subDir != null && !subDir.isEmpty()) {
                uploadPath = uploadPath.resolve(subDir);
            }
            Path filePath = uploadPath.resolve(filename).normalize();
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Deleted file: {}", filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            log.error("Failed to delete file", e);
            return false;
        }
    }

    public FileStorageService(final FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
    }
}
