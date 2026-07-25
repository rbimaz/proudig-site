package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentPermission;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentShareDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Tests für DocumentShareService – Personal-Download-Gate und
 * Admin-Freigabeverwaltung.
 */
@ExtendWith(MockitoExtension.class)
class DocumentShareServiceTest {

    @Mock private DocumentShareRepository documentShareRepository;
    @Mock private DocumentRepository documentRepository;
    @Mock private UserRepository userRepository;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks private DocumentShareService documentShareService;

    private User owner;
    private User admin;
    private User consultant;
    private User client;
    private Document ownDoc;

    @BeforeEach
    void setUp() {
        Role adminRole = new Role();
        adminRole.setName("ADMIN");
        Role consultantRole = new Role();
        consultantRole.setName("CONSULTANT");

        owner = user("owner-id");
        admin = user("admin-id");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));
        consultant = user("consultant-id");
        consultant.setRoles(new HashSet<>(Set.of(consultantRole)));
        client = user("client-id");

        ownDoc = Document.builder().id("doc-1").fileName("f.pdf").uploadedBy(owner).build();
    }

    private User user(String id) {
        User u = new User();
        u.setId(id);
        u.setEmail(id + "@test.de");
        u.setRoles(new HashSet<>());
        return u;
    }

    @Test
    @DisplayName("Given Admin, When canAccessDocument, Then true (Personal-Gate)")
    void adminCanAccessAnyDocument() {
        when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

        assertThat(documentShareService.canAccessDocument("doc-1", admin)).isTrue();
        verify(documentShareRepository, never()).findByDocumentAndSharedWith(any(), any());
    }

    @Test
    @DisplayName("Given Consultant, When canAccessDocument, Then true (Personal-Gate)")
    void consultantCanAccessAnyDocument() {
        when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

        assertThat(documentShareService.canAccessDocument("doc-1", consultant)).isTrue();
    }

    @Test
    @DisplayName("Given Client ohne Freigabe, When canAccessDocument, Then false")
    void clientWithoutShareDenied() {
        when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
        when(documentShareRepository.findByDocumentAndSharedWith(ownDoc, client)).thenReturn(Optional.empty());

        assertThat(documentShareService.canAccessDocument("doc-1", client)).isFalse();
    }

    @Test
    @DisplayName("Given Admin, When fremdes Dokument freigeben, Then Freigabe angelegt")
    void adminCanShareForeignDocument() {
        when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
        when(userRepository.findByEmail("client-id@test.de")).thenReturn(Optional.of(client));
        when(documentShareRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        DocumentShareDto dto = documentShareService.shareDocument(
                "doc-1", "client-id@test.de", DocumentPermission.VIEW, null, admin);

        assertThat(dto).isNotNull();
        assertThat(dto.getDocumentId()).isEqualTo("doc-1");
    }

    @Test
    @DisplayName("Given Client ohne Eigentum, When freigeben, Then Zugriff verweigert")
    void clientCannotShareForeignDocument() {
        when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

        assertThatThrownBy(() -> documentShareService.shareDocument(
                "doc-1", "x@test.de", DocumentPermission.VIEW, null, client))
                .isInstanceOf(IllegalAccessError.class);
        verify(documentShareRepository, never()).save(any());
    }
}
