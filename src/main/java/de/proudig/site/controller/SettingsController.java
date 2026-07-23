package de.proudig.site.controller;

import de.proudig.site.domain.User;
import de.proudig.site.dto.NewsSettingsDto;
import de.proudig.site.service.SettingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Verwaltung der Systemeinstellungen (nur ADMIN). Aktuell die News-Lebenszyklus-Defaults.
 */
@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class SettingsController {

    private final SettingService settingService;

    public SettingsController(final SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    public ResponseEntity<NewsSettingsDto> getSettings() {
        return ResponseEntity.ok(new NewsSettingsDto(
                settingService.getNewsDefaultArchiveAfter(),
                settingService.getNewsArchiveRetentionRaw(),
                settingService.getNewsLifecycleCron()));
    }

    @PutMapping
    public ResponseEntity<NewsSettingsDto> updateSettings(@RequestBody NewsSettingsDto request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String defaultAfter = request.getDefaultArchiveAfter() == null ? "" : request.getDefaultArchiveAfter();

        // Erst alle Werte validieren, dann persistieren — sonst bliebe bei einem ungültigen
        // Wert ein Teil der Änderungen gespeichert (Spec: bisheriger Wert bleibt erhalten).
        settingService.validate(SettingService.KEY_DEFAULT_ARCHIVE_AFTER, defaultAfter);
        settingService.validate(SettingService.KEY_ARCHIVE_RETENTION, request.getArchiveRetention());
        settingService.validate(SettingService.KEY_LIFECYCLE_CRON, request.getLifecycleCron());

        settingService.set(SettingService.KEY_DEFAULT_ARCHIVE_AFTER, defaultAfter, user);
        settingService.set(SettingService.KEY_ARCHIVE_RETENTION, request.getArchiveRetention(), user);
        settingService.set(SettingService.KEY_LIFECYCLE_CRON, request.getLifecycleCron(), user);
        return getSettings();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
