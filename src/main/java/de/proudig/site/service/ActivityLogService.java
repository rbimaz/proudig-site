package de.proudig.site.service;

import de.proudig.site.domain.ActivityLog;
import de.proudig.site.domain.User;
import de.proudig.site.dto.ActivityLogDto;
import de.proudig.site.repository.ActivityLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    public void log(User user, String action, String entityType, String entityId, String details) {
        ActivityLog log = ActivityLog.builder().user(user).action(action).entityType(entityType).entityId(entityId).details(details).build();
        activityLogRepository.save(log);
    }

    public Page<ActivityLogDto> getRecentActivity(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToDto);
    }

    public Page<ActivityLogDto> getUserActivity(String userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable).map(this::mapToDto);
    }

    public Page<ActivityLogDto> getEntityActivity(String entityType, Pageable pageable) {
        return activityLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType, pageable).map(this::mapToDto);
    }

    private ActivityLogDto mapToDto(ActivityLog log) {
        String userName = "";
        String userEmail = "";
        if (log.getUser() != null) {
            userEmail = log.getUser().getEmail();
            String firstName = log.getUser().getFirstName() != null ? log.getUser().getFirstName() : "";
            String lastName = log.getUser().getLastName() != null ? log.getUser().getLastName() : "";
            userName = (firstName + " " + lastName).trim();
        }
        return ActivityLogDto.builder().id(log.getId()).userId(log.getUser().getId()).userEmail(userEmail).userName(userName).action(log.getAction()).entityType(log.getEntityType()).entityId(log.getEntityId()).details(log.getDetails()).createdAt(log.getCreatedAt()).build();
    }

    public ActivityLogService(final ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }
}
