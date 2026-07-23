package de.proudig.site.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @Column(name = "setting_key", length = 100)
    private String key;
    @Column(name = "setting_value", length = 500)
    private String value;
    @Column(name = "updated_at")
    private Instant updatedAt;
    @Column(name = "updated_by", length = 36)
    private String updatedBy;

    public Setting() {
    }

    public Setting(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
