package de.proudig.site.controller;

import de.proudig.site.service.SettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Öffentlicher, auth-freier Status der Website. Gibt bewusst nur den Launch-Status
 * preis (kein Zugriff auf weitere Einstellungen), damit das Frontend-Gate vor jeder
 * Authentifizierung entscheiden kann.
 */
@RestController
@RequestMapping("/api/public")
public class PublicSiteController {

    private final SettingService settingService;

    public PublicSiteController(final SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping("/site-status")
    public ResponseEntity<Map<String, Object>> siteStatus() {
        return ResponseEntity.ok(Map.of("launched", settingService.isSiteLaunched()));
    }
}
