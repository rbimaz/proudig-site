package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.FolderShare;
import de.proudig.site.domain.User;
import de.proudig.site.domain.UserGroup;
import de.proudig.site.dto.FolderDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    private final DocumentRepository documentRepository;
    private final FolderShareRepository folderShareRepository;
    private final UserGroupRepository userGroupRepository;
    private final PortalAccessService access;
    private final ActivityLogService activityLogService;

    /**
     * Root-Ordner: ADMIN sieht alle; sonst eigene Roots plus die dem Nutzer (direkt
     * oder über eine Gruppe) freigegebenen Ordner als virtuelle Roots.
     */
    public List<FolderDto> getRootFolders(User user) {
        if (isAdmin(user)) {
            return folderRepository.findByParentFolderIsNull().stream().map(this::mapToDto).collect(Collectors.toList());
        }
        Map<String, Folder> roots = new LinkedHashMap<>();
        for (Folder f : folderRepository.findByOwnerAndParentFolderIsNull(user)) {
            roots.put(f.getId(), f);
        }
        List<UserGroup> groups = userGroupRepository.findByMembersContains(user);
        for (FolderShare share : folderShareRepository.findBySharedWithUserOrSharedWithGroupIn(user, groups)) {
            Folder f = share.getFolder();
            roots.putIfAbsent(f.getId(), f);
        }
        return roots.values().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<FolderDto> getSubFolders(String parentFolderId, User user) {
        Folder parentFolder = folderRepository.findById(parentFolderId).orElseThrow(() -> new NoSuchElementException("Folder not found: " + parentFolderId));
        if (!access.canRead(user, parentFolder)) {
            throw new IllegalAccessError("Access denied");
        }
        return folderRepository.findByParentFolder(parentFolder).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public FolderDto getFolderById(String folderId, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));
        if (!access.canRead(user, folder)) {
            throw new NoSuchElementException("Folder not found: " + folderId);
        }
        return mapToDto(folder);
    }

    public FolderDto createFolder(String name, String parentFolderId, User owner) {
        Folder folder = Folder.builder().name(name).owner(owner).build();
        if (parentFolderId != null) {
            Folder parentFolder = folderRepository.findById(parentFolderId).orElseThrow(() -> new NoSuchElementException("Parent folder not found"));
            if (!access.canWrite(owner, parentFolder)) {
                throw new IllegalAccessError("Access denied");
            }
            folder.setParentFolder(parentFolder);
        }
        folder = folderRepository.save(folder);
        activityLogService.log(owner, "CREATE", "FOLDER", folder.getId(), folder.getName());
        return mapToDto(folder);
    }

    public FolderDto updateFolder(String folderId, String name, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));
        // Umbenennen ist eine Mutation der Ordnerstruktur: nur FULL (Owner/ADMIN/selbst angelegt).
        if (!access.canDeleteFolder(user, folder)) {
            throw new IllegalAccessError("Access denied");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Folder name cannot be empty");
        }
        folder.setName(name.trim());
        folder.setUpdatedAt(Instant.now());
        folder = folderRepository.save(folder);
        activityLogService.log(user, "RENAME", "FOLDER", folder.getId(), folder.getName());
        return mapToDto(folder);
    }

    @Transactional
    public FolderDto moveFolder(String folderId, String newParentId, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));
        Folder newParent = null;
        if (newParentId != null) {
            newParent = folderRepository.findById(newParentId).orElseThrow(() -> new NoSuchElementException("Target folder not found: " + newParentId));
            // Zyklus-Schutz: Ziel darf nicht der Ordner selbst oder ein Nachfahre sein
            for (Folder cursor = newParent; cursor != null; cursor = cursor.getParentFolder()) {
                if (cursor.getId().equals(folder.getId())) {
                    throw new IllegalArgumentException("Ein Ordner kann nicht in sich selbst oder einen seiner Unterordner verschoben werden.");
                }
            }
        }
        if (!access.canMoveFolder(user, folder, newParent)) {
            throw new IllegalAccessError("Access denied");
        }
        folder.setParentFolder(newParent);
        folder.setUpdatedAt(Instant.now());
        folder = folderRepository.save(folder);
        activityLogService.log(user, "MOVE", "FOLDER", folder.getId(), folder.getName());
        return mapToDto(folder);
    }

    @Transactional
    public void deleteFolder(String folderId, User user) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found: " + folderId));
        if (!access.canDeleteFolder(user, folder)) {
            throw new IllegalAccessError("Access denied");
        }
        deleteFolderRecursive(folder);
        activityLogService.log(user, "DELETE", "FOLDER", folder.getId(), folder.getName());
    }

    private void deleteFolderRecursive(Folder folder) {
        for (Folder child : folderRepository.findByParentFolder(folder)) {
            deleteFolderRecursive(child);
        }
        List<Document> documents = documentRepository.findByFolder(folder);
        documentRepository.deleteAll(documents);
        folderShareRepository.deleteByFolder(folder);
        folderRepository.delete(folder);
    }

    private boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    private FolderDto mapToDto(Folder folder) {
        long childCount = folderRepository.countByParentFolder(folder);
        FolderDto dto = FolderDto.builder().id(folder.getId()).name(folder.getName()).parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getId() : null).ownerId(folder.getOwner().getId()).createdAt(folder.getCreatedAt()).updatedAt(folder.getUpdatedAt()).documentCount(documentRepository.countByFolder(folder)).childFolderCount(childCount).hasChildren(childCount > 0).build();
        dto.setShared(!folderShareRepository.findByFolder(folder).isEmpty());
        return dto;
    }

    public FolderService(final FolderRepository folderRepository, final DocumentRepository documentRepository,
                         final FolderShareRepository folderShareRepository, final UserGroupRepository userGroupRepository,
                         final PortalAccessService access, final ActivityLogService activityLogService) {
        this.folderRepository = folderRepository;
        this.documentRepository = documentRepository;
        this.folderShareRepository = folderShareRepository;
        this.userGroupRepository = userGroupRepository;
        this.access = access;
        this.activityLogService = activityLogService;
    }
}
