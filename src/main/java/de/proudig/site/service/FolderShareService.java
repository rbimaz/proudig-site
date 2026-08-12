package de.proudig.site.service;

import de.proudig.site.domain.*;
import de.proudig.site.dto.FolderShareDto;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
import de.proudig.site.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Interne Ordner-Freigaben (READ/WRITE) an einen Nutzer oder eine Gruppe.
 * ADMIN-only (Enforcement am Controller). Upsert je (Ordner, Ziel).
 */
@Service
public class FolderShareService {
    private final FolderRepository folderRepository;
    private final FolderShareRepository shareRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository groupRepository;
    private final ActivityLogService activityLogService;

    public FolderShareService(FolderRepository folderRepository, FolderShareRepository shareRepository,
                              UserRepository userRepository, UserGroupRepository groupRepository,
                              ActivityLogService activityLogService) {
        this.folderRepository = folderRepository;
        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.activityLogService = activityLogService;
    }

    public List<FolderShareDto> getShares(String folderId) {
        Folder folder = getFolder(folderId);
        return shareRepository.findByFolder(folder).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public FolderShareDto shareFolder(String folderId, String userId, String groupId, String permissionRaw, User admin) {
        if ((userId == null) == (groupId == null)) {
            throw new IllegalArgumentException("Genau ein Ziel (userId ODER groupId) angeben");
        }
        SharePermission permission = parsePermission(permissionRaw);
        Folder folder = getFolder(folderId);

        FolderShare share;
        if (userId != null) {
            User target = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
            share = shareRepository.findByFolderAndSharedWithUser(folder, target).orElseGet(FolderShare::new);
            share.setSharedWithUser(target);
        } else {
            UserGroup target = groupRepository.findById(groupId).orElseThrow(() -> new NoSuchElementException("Group not found"));
            share = shareRepository.findByFolderAndSharedWithGroup(folder, target).orElseGet(FolderShare::new);
            share.setSharedWithGroup(target);
        }
        share.setFolder(folder);
        share.setPermission(permission);
        share.setSharedBy(admin);
        share = shareRepository.save(share);
        activityLogService.log(admin, "SHARE", "FOLDER", folder.getId(), folder.getName());
        return mapToDto(share);
    }

    @Transactional
    public void revokeShare(String folderId, String shareId, User admin) {
        Folder folder = getFolder(folderId);
        FolderShare share = shareRepository.findById(shareId).orElseThrow(() -> new NoSuchElementException("Share not found"));
        if (!share.getFolder().getId().equals(folder.getId())) {
            throw new NoSuchElementException("Share not found");
        }
        shareRepository.delete(share);
        activityLogService.log(admin, "UNSHARE", "FOLDER", folder.getId(), folder.getName());
    }

    private Folder getFolder(String folderId) {
        return folderRepository.findById(folderId).orElseThrow(() -> new NoSuchElementException("Folder not found"));
    }

    private SharePermission parsePermission(String raw) {
        try {
            return SharePermission.valueOf(raw == null ? "" : raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Berechtigung muss READ oder WRITE sein");
        }
    }

    private FolderShareDto mapToDto(FolderShare s) {
        if (s.getSharedWithUser() != null) {
            User u = s.getSharedWithUser();
            return new FolderShareDto(s.getId(), s.getPermission().name(), "USER", u.getId(),
                    u.getFirstName() + " " + u.getLastName());
        }
        UserGroup g = s.getSharedWithGroup();
        return new FolderShareDto(s.getId(), s.getPermission().name(), "GROUP", g.getId(), g.getName());
    }
}
