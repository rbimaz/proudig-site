package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.MediaDto;
import de.proudig.site.service.MediaService;
import de.proudig.site.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MediaController {
    private final MediaService mediaService;
    private final FileStorageService fileStorageService;

    @PostMapping("/admin/media")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'CONSULTANT\')")
    public ResponseEntity<MediaDto> uploadMedia(@RequestParam("file") MultipartFile file) throws IOException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MediaDto media = mediaService.uploadMedia(file, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(media);
    }

    @GetMapping("/admin/media")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'CONSULTANT\')")
    public ResponseEntity<List<MediaDto>> getAllMedia() {
        List<MediaDto> media = mediaService.getAllMedia();
        return ResponseEntity.ok(media);
    }

    @DeleteMapping("/admin/media/{id}")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'CONSULTANT\')")
    public ResponseEntity<Void> deleteMedia(@PathVariable String id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        mediaService.deleteMedia(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/media/{id}")
    public ResponseEntity<Resource> serveMedia(@PathVariable String id) {
        try {
            MediaDto media = mediaService.getMedia(id);
            Resource resource = fileStorageService.load(mediaService.getMediaFilePath(id), "media");
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(media.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getName() + "\"").body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/media/{id}/thumbnail")
    public ResponseEntity<Resource> serveThumbnail(@PathVariable String id) {
        try {
            MediaDto media = mediaService.getMedia(id);
            Resource resource = fileStorageService.load(mediaService.getMediaFilePath(id), "media");
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(media.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getName() + "\"").body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    public MediaController(final MediaService mediaService, final FileStorageService fileStorageService) {
        this.mediaService = mediaService;
        this.fileStorageService = fileStorageService;
    }
}
