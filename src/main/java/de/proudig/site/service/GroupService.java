package de.proudig.site.service;

import de.proudig.site.domain.User;
import de.proudig.site.domain.UserGroup;
import de.proudig.site.dto.GroupDto;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
import de.proudig.site.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Verwaltung von Nutzergruppen (ADMIN). Mitglieder müssen Portal-Nutzer
 * (ADMIN/CONSULTANT) sein; ein CLIENT kann nicht Mitglied werden.
 */
@Service
public class GroupService {
    private final UserGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final FolderShareRepository folderShareRepository;

    public GroupService(UserGroupRepository groupRepository, UserRepository userRepository,
                        FolderShareRepository folderShareRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.folderShareRepository = folderShareRepository;
    }

    public List<GroupDto> getGroups() {
        return groupRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public GroupDto createGroup(String name, User admin) {
        String trimmed = requireName(name);
        if (groupRepository.existsByName(trimmed)) {
            throw new IllegalArgumentException("Group name already exists");
        }
        UserGroup group = groupRepository.save(new UserGroup(trimmed, admin));
        return mapToDto(group);
    }

    public GroupDto renameGroup(String groupId, String name) {
        UserGroup group = getGroup(groupId);
        String trimmed = requireName(name);
        groupRepository.findByName(trimmed).ifPresent(existing -> {
            if (!existing.getId().equals(groupId)) {
                throw new IllegalArgumentException("Group name already exists");
            }
        });
        group.setName(trimmed);
        return mapToDto(groupRepository.save(group));
    }

    @Transactional
    public void deleteGroup(String groupId) {
        UserGroup group = getGroup(groupId);
        // An die Gruppe gebundene Freigaben entfernen (anderweitiger Zugriff bleibt).
        folderShareRepository.deleteBySharedWithGroup(group);
        group.getMembers().clear();
        groupRepository.delete(group);
    }

    public List<Map<String, String>> getMembers(String groupId) {
        UserGroup group = getGroup(groupId);
        return group.getMembers().stream()
                .map(u -> Map.of("userId", u.getId(),
                        "name", u.getFirstName() + " " + u.getLastName(),
                        "email", u.getEmail()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addMember(String groupId, String userId) {
        UserGroup group = getGroup(groupId);
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        if (!isPortalUser(user)) {
            throw new IllegalArgumentException("Only ADMIN/CONSULTANT can be group members");
        }
        group.getMembers().add(user);
        groupRepository.save(group);
    }

    @Transactional
    public void removeMember(String groupId, String userId) {
        UserGroup group = getGroup(groupId);
        group.getMembers().removeIf(u -> u.getId().equals(userId));
        groupRepository.save(group);
    }

    private UserGroup getGroup(String groupId) {
        return groupRepository.findById(groupId).orElseThrow(() -> new NoSuchElementException("Group not found"));
    }

    private String requireName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be empty");
        }
        return name.trim();
    }

    private boolean isPortalUser(User user) {
        return user.getRoles().stream()
                .anyMatch(r -> "ADMIN".equals(r.getName()) || "CONSULTANT".equals(r.getName()));
    }

    private GroupDto mapToDto(UserGroup group) {
        return new GroupDto(group.getId(), group.getName(), group.getCreatedAt(), group.getMembers().size());
    }
}
