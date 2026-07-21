package de.proudig.site.service;

import de.proudig.site.domain.Media;
import de.proudig.site.domain.User;
import de.proudig.site.dto.MediaDto;
import de.proudig.site.repository.MediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class MediaService {
    private final MediaRepository mediaRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;

    public MediaDto uploadMedia(MultipartFile file, User user) throws IOException {
        String storagePath = fileStorageService.store(file, "media");
        Media media = Media.builder().name(file.getOriginalFilename()).title(file.getOriginalFilename()).contentType(file.getContentType()).storagePath(storagePath).fileSize(file.getSize()).uploadedBy(user).build();
        media = mediaRepository.save(media);
        activityLogService.log(user, "UPLOAD", "MEDIA", media.getId(), media.getName());
        return mapToDto(media);
    }

    public List<MediaDto> getAllMedia() {
        return mediaRepository.findAllByOrderByCreatedAtDesc().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public MediaDto getMedia(String id) {
        Media media = mediaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Media not found: " + id));
        return mapToDto(media);
    }

    public void deleteMedia(String id, User user) {
        Media media = mediaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Media not found: " + id));
        fileStorageService.delete(media.getStoragePath(), "media");
        activityLogService.log(user, "DELETE", "MEDIA", media.getId(), media.getName());
        mediaRepository.delete(media);
    }

    public MediaDto updateMedia(String id, String name, User user) {
        Media media = mediaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Media not found: " + id));
        media.setName(name);
        media.setTitle(name);
        media = mediaRepository.save(media);
        activityLogService.log(user, "UPDATE", "MEDIA", media.getId(), media.getName());
        return mapToDto(media);
    }

    public String getMediaFilePath(String id) {
        Media media = mediaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Media not found: " + id));
        return media.getStoragePath();
    }

    private MediaDto mapToDto(Media media) {
        return MediaDto.builder().id(media.getId()).name(media.getName()).title(media.getTitle()).contentType(media.getContentType()).fileSize(media.getFileSize()).createdAt(media.getCreatedAt()).build();
    }

    public MediaService(final MediaRepository mediaRepository, final FileStorageService fileStorageService, final ActivityLogService activityLogService) {
        this.mediaRepository = mediaRepository;
        this.fileStorageService = fileStorageService;
        this.activityLogService = activityLogService;
    }
}
