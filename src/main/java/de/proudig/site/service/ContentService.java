package de.proudig.site.service;

import de.proudig.site.domain.ContentBlock;
import de.proudig.site.domain.User;
import de.proudig.site.dto.ContentBlockDto;
import de.proudig.site.repository.ContentBlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {
    private final ContentBlockRepository contentBlockRepository;
    private final ActivityLogService activityLogService;

    public ContentBlockDto getPublishedContent(String sectionKey) {
        ContentBlock block = contentBlockRepository.findBySectionKey(sectionKey)
                .orElseThrow(() -> new NoSuchElementException("Content block not found: " + sectionKey));
        if (block.getPublishedAt() == null) {
            throw new NoSuchElementException("Content block is not published: " + sectionKey);
        }
        return mapToDto(block);
    }

    public List<ContentBlockDto> getAllPublished() {
        return contentBlockRepository.findAllByPublishedAtIsNotNull()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ContentBlockDto getDraft(String sectionKey) {
        ContentBlock block = contentBlockRepository.findBySectionKey(sectionKey)
                .orElseThrow(() -> new NoSuchElementException("Content block not found: " + sectionKey));
        return mapToDto(block);
    }

    public List<ContentBlockDto> getAllForAdmin() {
        return contentBlockRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ContentBlockDto saveDraft(String sectionKey, String contentJson, User user) {
        ContentBlock block = contentBlockRepository.findBySectionKey(sectionKey)
                .orElseGet(() -> ContentBlock.builder()
                        .sectionKey(sectionKey)
                        .build());
        block.setDraftContent(contentJson);
        block.setUpdatedBy(user);
        block.setUpdatedAt(Instant.now());
        block = contentBlockRepository.save(block);
        activityLogService.log(user, "CONTENT_EDIT", "CONTENT_BLOCK", block.getId(), sectionKey);
        return mapToDto(block);
    }

    public ContentBlockDto publish(String sectionKey, User user) {
        ContentBlock block = contentBlockRepository.findBySectionKey(sectionKey)
                .orElseThrow(() -> new NoSuchElementException("Content block not found: " + sectionKey));
        if (block.getDraftContent() != null) {
            block.setContent(block.getDraftContent());
        }
        block.setPublishedAt(Instant.now());
        block.setUpdatedBy(user);
        block.setUpdatedAt(Instant.now());
        block = contentBlockRepository.save(block);
        activityLogService.log(user, "CONTENT_PUBLISH", "CONTENT_BLOCK", block.getId(), sectionKey);
        return mapToDto(block);
    }

    private ContentBlockDto mapToDto(ContentBlock block) {
        return ContentBlockDto.builder()
                .id(block.getId())
                .sectionKey(block.getSectionKey())
                .content(block.getContent())
                .draftContent(block.getDraftContent())
                .updatedAt(block.getUpdatedAt())
                .publishedAt(block.getPublishedAt())
                .build();
    }
}
