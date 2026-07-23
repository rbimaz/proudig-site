package de.proudig.site.service;

import de.proudig.site.domain.Setting;
import de.proudig.site.repository.SettingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SettingServiceTest {

    @Mock private SettingRepository settingRepository;

    private SettingService settingService;

    @BeforeEach
    void setUp() {
        Clock fixed = Clock.fixed(Instant.parse("2026-06-01T00:00:00Z"), ZoneOffset.UTC);
        settingService = new SettingService(settingRepository, fixed, "", "90d", "0 0 * * * *");
    }

    @Test
    @DisplayName("Fallback: ohne DB-Wert greift der Property-Default")
    void fallsBackToPropertyDefault() {
        when(settingRepository.findById(SettingService.KEY_ARCHIVE_RETENTION)).thenReturn(Optional.empty());
        assertThat(settingService.getNewsArchiveRetention()).isEqualTo(Duration.ofDays(90));
    }

    @Test
    @DisplayName("DB-Wert überschreibt den Property-Default")
    void dbValueOverridesDefault() {
        when(settingRepository.findById(SettingService.KEY_ARCHIVE_RETENTION))
                .thenReturn(Optional.of(new Setting(SettingService.KEY_ARCHIVE_RETENTION, "30s")));
        assertThat(settingService.getNewsArchiveRetention()).isEqualTo(Duration.ofSeconds(30));
    }

    @Test
    @DisplayName("Leerer DB-Wert wird ignoriert (Fallback greift)")
    void blankDbValueIgnored() {
        when(settingRepository.findById(SettingService.KEY_LIFECYCLE_CRON))
                .thenReturn(Optional.of(new Setting(SettingService.KEY_LIFECYCLE_CRON, "  ")));
        assertThat(settingService.getNewsLifecycleCron()).isEqualTo("0 0 * * * *");
    }

    @Test
    @DisplayName("Ungültiger Cron-Wert wird beim Setzen abgewiesen")
    void rejectsInvalidCron() {
        assertThatThrownBy(() -> settingService.set(SettingService.KEY_LIFECYCLE_CRON, "kein-cron", null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Ungültige Duration wird beim Setzen abgewiesen")
    void rejectsInvalidDuration() {
        assertThatThrownBy(() -> settingService.set(SettingService.KEY_ARCHIVE_RETENTION, "30x", null))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
