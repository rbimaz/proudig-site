package de.proudig.site.controller;

import de.proudig.site.dto.ContactMessageDto;
import de.proudig.site.service.ContactMessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactMessageService;

    /**
     * Öffentlicher Endpoint: Neue Kontaktnachricht absenden.
     * Mit Rate-Limiting: Max. 5 Nachrichten pro Stunde pro IP.
     */
    @PostMapping("/api/contact")
    public ResponseEntity<?> sendMessage(
            @Valid @RequestBody ContactMessageDto dto,
            HttpServletRequest request) {

        String ipAddress = getClientIp(request);

        // Rate-Limiting prüfen
        if (contactMessageService.isRateLimited(ipAddress)) {
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Zu viele Anfragen. Bitte versuchen Sie es später erneut."));
        }

        // Anfrage registrieren
        contactMessageService.recordRequest(ipAddress);

        // Nachricht speichern
        ContactMessageDto saved = contactMessageService.saveMessage(dto);

        return ResponseEntity.ok(Map.of(
                "message", "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen.",
                "id", saved.getId()
        ));
    }

    // ========== Admin-Endpoints ==========

    /**
     * Alle Nachrichten abrufen.
     */
    @GetMapping("/api/admin/messages")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<List<ContactMessageDto>> getAllMessages(
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        List<ContactMessageDto> messages = unreadOnly
                ? contactMessageService.getUnreadMessages()
                : contactMessageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    /**
     * Anzahl ungelesener Nachrichten.
     */
    @GetMapping("/api/admin/messages/unread-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = contactMessageService.getUnreadCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Einzelne Nachricht abrufen.
     */
    @GetMapping("/api/admin/messages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<ContactMessageDto> getMessage(@PathVariable String id) {
        ContactMessageDto message = contactMessageService.getMessage(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Nachricht als gelesen markieren.
     */
    @PutMapping("/api/admin/messages/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<ContactMessageDto> markAsRead(@PathVariable String id) {
        ContactMessageDto message = contactMessageService.markAsRead(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Nachricht als ungelesen markieren.
     */
    @PutMapping("/api/admin/messages/{id}/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<ContactMessageDto> markAsUnread(@PathVariable String id) {
        ContactMessageDto message = contactMessageService.markAsUnread(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Nachricht löschen.
     */
    @DeleteMapping("/api/admin/messages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable String id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.ok(Map.of("message", "Nachricht gelöscht"));
    }

    /**
     * Mehrere Nachrichten löschen.
     */
    @PostMapping("/api/admin/messages/delete-batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT')")
    public ResponseEntity<Map<String, String>> deleteMessages(@RequestBody List<String> ids) {
        contactMessageService.deleteMessages(ids);
        return ResponseEntity.ok(Map.of("message", ids.size() + " Nachricht(en) gelöscht"));
    }

    /**
     * Ermittelt die Client-IP-Adresse (berücksichtigt Proxy-Header).
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Erste IP in der Kette ist die ursprüngliche Client-IP
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
