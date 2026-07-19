package de.proudig.site.controller;

import de.proudig.site.dto.ActivityLogDto;
import de.proudig.site.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/activity")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<Page<ActivityLogDto>> getActivity(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String type,
            Pageable pageable) {
        if (userId != null) {
            return ResponseEntity.ok(activityLogService.getUserActivity(userId, pageable));
        }
        if (type != null) {
            return ResponseEntity.ok(activityLogService.getEntityActivity(type, pageable));
        }
        return ResponseEntity.ok(activityLogService.getRecentActivity(pageable));
    }
}
