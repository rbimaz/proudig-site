package de.proudig.site;

import de.proudig.site.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(FileStorageProperties.class)
public class ProudigSiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProudigSiteApplication.class, args);
    }

}
