package de.proudig.site.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class AppConfig {

    /**
     * Zentrale Zeitquelle. In Tests durch eine fixe Clock ersetzbar, um
     * zeitgesteuerte Logik (Auto-Archivierung/-Ausblendung) deterministisch zu prüfen.
     */
    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}
