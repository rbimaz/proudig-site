package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import de.proudig.site.dto.FolderDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final DocumentRepository documentRepository;

    public List<FolderDto> getRootFolders(User owner) {
        return folderRepository.findByOwnerAndParentFolderIsNull(owner)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FolderDto> getSubFolders(String parentFolderId, User owner) {
        Folder parentFolder = folderRepository.findById(parentFolderId)
                .orElseThrow(() -> new NoSuchElementException("Folder not found: " + parentFolderId));

        if (!parentFolder.getOwner().getId().equals(owner.getId())) {
            throw new IllegalAccessError("Access denied");
        }

        return folderRepository.findByOwnerAndParentFolder(owner, parentFolder)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FolderDto getFolderById(String folderId, User owner) {
        Folder folder = folderRepository.findByIdAndOwner(folderId, owner)
                .orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));
        return mapToDto(folder);
    }

    public FolderDto createFolder(String name, String parentFolderId, User owner) {
        Folder folder = Folder.builder()
                .name(name)
                .owner(owner)
                .build();

        if (parentFolderId != null) {
            Folder parentFolder = folderRepository.findById(parentFolderId)
                    .orElseThrow(() -> new NoSuchElementException("Parent folder not found"));
            if (!parentFolder.getOwner().getId().equals(owner.getId())) {
                throw new IllegalAccessError("Access denied");
            }
            folder.setParentFolder(parentFolder);
        }

        folder = folderRepository.save(folder);
        return mapToDto(folder);
    }

    public FolderDto updateFolder(String folderId, String name, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));

        if (!canAccess(folder, user)) {
            throw new IllegalAccessError("Access denied");
        }

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Folder name cannot be empty");
        }

        folder.setName(name.trim());
        folder.setUpdatedAt(Instant.now());
        folder = folderRepository.save(folder);
        return mapToDto(folder);
    }

    @Transactional
    public FolderDto moveFolder(String folderId, String newParentId, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));

        if (!canAccess(folder, user)) {
            throw new IllegalAccessError("Access denied");
        }

        Folder newParent = null;
        if (newParentId != null) {
            newParent = folderRepository.findById(newParentId)
                    .orElseThrow(() -> new NoSuchElementException("Target folder not found: " + newParentId));

            if (!canAccess(newParent, user)) {
                throw new IllegalAccessError("Access denied");
            }

            // Zyklus-Schutz: Ziel darf nicht der Ordner selbst oder ein Nachfahre sein
            for (Folder cursor = newParent; cursor != null; cursor = cursor.getParentFolder()) {
                if (cursor.getId().equals(folder.getId())) {
                    throw new IllegalArgumentException(
                            "Ein Ordner kann nicht in sich selbst oder einen seiner Unterordner verschoben werden.");
                }
            }
        }

        folder.setParentFolder(newParent);
        folder.setUpdatedAt(Instant.now());
        folder = folderRepository.save(folder);
        return mapToDto(folder);
    }

    @Transactional
    public void deleteFolder(String folderId, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));

        if (!canAccess(folder, user)) {
            throw new IllegalAccessError("Access denied");
        }

        deleteFolderRecursive(folder);
    }

    private void deleteFolderRecursive(Folder folder) {
        // Erst alle Unterordner rekursiv löschen
        List<Folder> children = folderRepository.findByParentFolder(folder);
        for (Folder child : children) {
            deleteFolderRecursive(child);
        }

        // Dann alle Dokumente im Ordner löschen
        List<Document> documents = documentRepository.findByFolder(folder);
        documentRepository.deleteAll(documents);

        // Schließlich den Ordner selbst löschen
        folderRepository.delete(folder);
    }

    private boolean canAccess(Folder folder, User user) {
        // Owner hat immer Zugriff
        if (folder.getOwner().getId().equals(user.getId())) {
            return true;
        }
        // Admins haben auch Zugriff
        return user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    private FolderDto mapToDto(Folder folder) {
        long childCount = folderRepository.countByParentFolder(folder);
        return FolderDto.builder()
                .id(folder.getId())
                .name(folder.getName())
                .parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getId() : null)
                .ownerId(folder.getOwner().getId())
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .documentCount(documentRepository.countByFolder(folder))
                .childFolderCount(childCount)
                .hasChildren(childCount > 0)
                .build();
    }
}
