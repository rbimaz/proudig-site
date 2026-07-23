package de.proudig.site.dto;

/**
 * News-Lebenszyklus-Defaults, die über die Admin-Einstellungsseite gelesen/geschrieben werden.
 * Duration-Werte im Format 30d/12h/45m/30s; Cron als Spring-Cron-Ausdruck.
 */
public class NewsSettingsDto {
    private String defaultArchiveAfter;
    private String archiveRetention;
    private String lifecycleCron;

    public NewsSettingsDto() {
    }

    public NewsSettingsDto(String defaultArchiveAfter, String archiveRetention, String lifecycleCron) {
        this.defaultArchiveAfter = defaultArchiveAfter;
        this.archiveRetention = archiveRetention;
        this.lifecycleCron = lifecycleCron;
    }

    public String getDefaultArchiveAfter() {
        return defaultArchiveAfter;
    }

    public void setDefaultArchiveAfter(String defaultArchiveAfter) {
        this.defaultArchiveAfter = defaultArchiveAfter;
    }

    public String getArchiveRetention() {
        return archiveRetention;
    }

    public void setArchiveRetention(String archiveRetention) {
        this.archiveRetention = archiveRetention;
    }

    public String getLifecycleCron() {
        return lifecycleCron;
    }

    public void setLifecycleCron(String lifecycleCron) {
        this.lifecycleCron = lifecycleCron;
    }
}
