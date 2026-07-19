package de.proudig.site.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "filestorage")
@Data
public class FileStorageProperties {
    private String location;
}
