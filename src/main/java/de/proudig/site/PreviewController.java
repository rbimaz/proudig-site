package de.proudig.site;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PreviewController {

    @Value("${app.preview-password}")
    private String previewPassword;

    @PostMapping("/preview-auth")
    public ResponseEntity<Map<String, Object>> authenticate(@RequestBody Map<String, String> body) {
        String password = body.getOrDefault("password", "");
        if (previewPassword.equals(password)) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Falsches Passwort"));
    }
}
