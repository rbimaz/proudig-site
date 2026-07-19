package de.proudig.site.service;

import de.proudig.site.domain.ContactMessage;
import de.proudig.site.dto.ContactMessageDto;
import de.proudig.site.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    // Rate-Limiting: IP -> Liste von Timestamps
    private final Map<String, CopyOnWriteArrayList<Long>> requestLog = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_HOUR = 5;
    private static final long ONE_HOUR_MS = 3600_000L;

    /**
     * Prüft, ob die IP-Adresse das Rate-Limit überschritten hat.
     */
    public boolean isRateLimited(String ipAddress) {
        long now = System.currentTimeMillis();
        long oneHourAgo = now - ONE_HOUR_MS;

        CopyOnWriteArrayList<Long> timestamps = requestLog.computeIfAbsent(
                ipAddress, k -> new CopyOnWriteArrayList<>()
        );

        // Alte Einträge entfernen
        timestamps.removeIf(t -> t < oneHourAgo);

        return timestamps.size() >= MAX_REQUESTS_PER_HOUR;
    }

    /**
     * Registriert eine Anfrage für Rate-Limiting.
     */
    public void recordRequest(String ipAddress) {
        CopyOnWriteArrayList<Long> timestamps = requestLog.computeIfAbsent(
                ipAddress, k -> new CopyOnWriteArrayList<>()
        );
        timestamps.add(System.currentTimeMillis());
    }

    /**
     * Speichert eine neue Kontaktnachricht.
     */
    @Transactional
    public ContactMessageDto saveMessage(ContactMessageDto dto) {
        ContactMessage entity = dto.toEntity();
        ContactMessage saved = contactMessageRepository.save(entity);
        return ContactMessageDto.fromEntity(saved);
    }

    /**
     * Gibt alle Nachrichten zurück, sortiert nach Erstellungsdatum (neueste zuerst).
     */
    @Transactional(readOnly = true)
    public List<ContactMessageDto> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ContactMessageDto::fromEntity)
                .toList();
    }

    /**
     * Gibt nur ungelesene Nachrichten zurück.
     */
    @Transactional(readOnly = true)
    public List<ContactMessageDto> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalseOrderByCreatedAtDesc()
                .stream()
                .map(ContactMessageDto::fromEntity)
                .toList();
    }

    /**
     * Gibt die Anzahl ungelesener Nachrichten zurück.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }

    /**
     * Gibt eine einzelne Nachricht zurück.
     */
    @Transactional(readOnly = true)
    public ContactMessageDto getMessage(String id) {
        return contactMessageRepository.findById(id)
                .map(ContactMessageDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Nachricht nicht gefunden"));
    }

    /**
     * Markiert eine Nachricht als gelesen.
     */
    @Transactional
    public ContactMessageDto markAsRead(String id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nachricht nicht gefunden"));
        message.setIsRead(true);
        return ContactMessageDto.fromEntity(contactMessageRepository.save(message));
    }

    /**
     * Markiert eine Nachricht als ungelesen.
     */
    @Transactional
    public ContactMessageDto markAsUnread(String id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nachricht nicht gefunden"));
        message.setIsRead(false);
        return ContactMessageDto.fromEntity(contactMessageRepository.save(message));
    }

    /**
     * Löscht eine Nachricht.
     */
    @Transactional
    public void deleteMessage(String id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("Nachricht nicht gefunden");
        }
        contactMessageRepository.deleteById(id);
    }

    /**
     * Löscht mehrere Nachrichten.
     */
    @Transactional
    public void deleteMessages(List<String> ids) {
        contactMessageRepository.deleteAllById(ids);
    }
}
