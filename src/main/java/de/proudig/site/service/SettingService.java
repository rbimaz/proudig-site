package de.proudig.site.service;

import de.proudig.site.domain.Setting;
import de.proudig.site.domain.User;
import de.proudig.site.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.convert.DurationStyle;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

/**
 * Persistente Systemeinstellungen (Key-Value) mit Property-Fallback:
 * Ein in der DB gesetzter Wert hat Vorrang, sonst greift der application.properties-Default.
 */
@Service
public class SettingService {

    public static final String KEY_DEFAULT_ARCHIVE_AFTER = "news.default-archive-after";
    public static final String KEY_ARCHIVE_RETENTION = "news.archive-retention";
    public static final String KEY_LIFECYCLE_CRON = "news.lifecycle-cron";

    private final SettingRepository settingRepository;
    private final Clock clock;
    private final String defaultArchiveAfterFallback;
    private final String archiveRetentionFallback;
    private final String lifecycleCronFallback;

    public SettingService(SettingRepository settingRepository, Clock clock,
                          @Value("${app.news.default-archive-after:}") String defaultArchiveAfterFallback,
                          @Value("${app.news.archive-retention:90d}") String archiveRetentionFallback,
                          @Value("${app.news.lifecycle-cron:0 0 * * * *}") String lifecycleCronFallback) {
        this.settingRepository = settingRepository;
        this.clock = clock;
        this.defaultArchiveAfterFallback = defaultArchiveAfterFallback;
        this.archiveRetentionFallback = archiveRetentionFallback;
        this.lifecycleCronFallback = lifecycleCronFallback;
    }

    /** Löst einen Wert auf: DB-Wert (falls gesetzt) vor Property-Fallback. */
    public String getString(String key, String fallback) {
        return settingRepository.findById(key)
                .map(Setting::getValue)
                .filter(v -> v != null && !v.isBlank())
                .orElse(fallback);
    }

    /** Setzt/aktualisiert einen Wert mit Validierung je nach Schlüssel. */
    public void set(String key, String value, User user) {
        validate(key, value);
        Setting setting = settingRepository.findById(key).orElse(new Setting(key, null));
        setting.setValue(value);
        setting.setUpdatedAt(Instant.now(clock));
        setting.setUpdatedBy(user != null ? user.getId() : null);
        settingRepository.save(setting);
    }

    // ── News-Lebenszyklus-Defaults (typisiert, mit Fallback) ──

    public String getNewsDefaultArchiveAfter() {
        return getString(KEY_DEFAULT_ARCHIVE_AFTER, defaultArchiveAfterFallback);
    }

    public Duration getNewsArchiveRetention() {
        return DurationStyle.detectAndParse(getNewsArchiveRetentionRaw());
    }

    /** Roh-String der Aufbewahrungsdauer (für die Anzeige in der UI). */
    public String getNewsArchiveRetentionRaw() {
        return getString(KEY_ARCHIVE_RETENTION, archiveRetentionFallback);
    }

    public String getNewsLifecycleCron() {
        return getString(KEY_LIFECYCLE_CRON, lifecycleCronFallback);
    }

    /** Prüft das Format bekannter Einstellungen; wirft IllegalArgumentException bei Ungültigkeit. */
    public void validate(String key, String value) {
        switch (key) {
            case KEY_DEFAULT_ARCHIVE_AFTER -> {
                // leer erlaubt = keine Default-Frist
                if (value != null && !value.isBlank()) {
                    DurationStyle.detectAndParse(value);
                }
            }
            case KEY_ARCHIVE_RETENTION -> DurationStyle.detectAndParse(value);
            case KEY_LIFECYCLE_CRON -> {
                if (value == null || !CronExpression.isValidExpression(value)) {
                    throw new IllegalArgumentException("Ungültiger Cron-Ausdruck: " + value);
                }
            }
            default -> throw new IllegalArgumentException("Unbekannter Einstellungs-Schlüssel: " + key);
        }
    }
}
