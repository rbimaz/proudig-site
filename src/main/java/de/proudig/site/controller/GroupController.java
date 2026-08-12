package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.GroupDto;
import de.proudig.site.service.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@PreAuthorize("hasRole('ADMIN')")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<GroupDto>> getGroups() {
        return ResponseEntity.ok(groupService.getGroups());
    }

    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody Map<String, String> request) {
        User admin = currentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.createGroup(request.get("name"), admin));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDto> renameGroup(@PathVariable String groupId, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(groupService.renameGroup(groupId, request.get("name")));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<Map<String, String>>> getMembers(@PathVariable String groupId) {
        return ResponseEntity.ok(groupService.getMembers(groupId));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Void> addMember(@PathVariable String groupId, @RequestBody Map<String, String> request) {
        groupService.addMember(groupId, request.get("userId"));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable String groupId, @PathVariable String userId) {
        groupService.removeMember(groupId, userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
