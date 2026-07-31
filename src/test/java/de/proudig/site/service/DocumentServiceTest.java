package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentShare;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Tests für DocumentService – neues Modell: nur ADMIN sieht alles,
 * CONSULTANT nur eigene + mit ihm geteilte; zentrale Zugriffsprüfung inkl. Download.
 */
@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock private DocumentRepository documentRepository;
    @Mock private FolderRepository folderRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private ActivityLogService activityLogService;
    @Mock private DocumentShareRepository shareRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private DocumentService documentService;

    private User owner;
    private User admin;
    private User consultant;
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

        ownDoc = Document.builder().id("doc-1").fileName("f.pdf").storagePath("p").uploadedBy(owner).build();
    }

    private User user(String id) {
        User u = new User();
        u.setId(id);
        u.setEmail(id + "@test.de");
        u.setRoles(new HashSet<>());
        return u;
    }

    @Nested
    @DisplayName("Dokumente auflisten (rollenabhängig)")
    class ListTests {

        @Test
        @DisplayName("Given Admin, When Liste, Then alle Dokumente")
        void adminSeesAllDocuments() {
            when(documentRepository.findAll()).thenReturn(List.of(ownDoc));

            List<DocumentDto> result = documentService.getDocumentsByUser(admin);

            assertThat(result).hasSize(1);
            verify(documentRepository, never()).findByUploadedBy(any());
        }

        @Test
        @DisplayName("Given Consultant, When Liste, Then nur eigene")
        void consultantSeesOnlyOwnDocuments() {
            when(documentRepository.findByUploadedBy(consultant)).thenReturn(List.of());

            assertThat(documentService.getDocumentsByUser(consultant)).isEmpty();
            verify(documentRepository, never()).findAll();
        }

        @Test
        @DisplayName("Given Consultant, When 'Mit mir geteilt', Then geteilte Dokumente")
        void consultantSeesSharedWithMe() {
            DocumentShare share = DocumentShare.builder().document(ownDoc).sharedWith(consultant).sharedBy(admin).build();
            when(shareRepository.findBySharedWith(consultant)).thenReturn(List.of(share));

            List<DocumentDto> result = documentService.getSharedWithMe(consultant);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given Consultant, When fremder Ordner, Then Zugriff verweigert")
        void consultantCannotListForeignFolderDocuments() {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));

            assertThatThrownBy(() -> documentService.getDocumentsInFolder("fld", consultant))
                    .isInstanceOf(IllegalAccessError.class);
        }
    }

    @Nested
    @DisplayName("Einzeldokument abrufen (canAccess)")
    class GetTests {

        @Test
        @DisplayName("Given Admin, When fremdes Dokument, Then Zugriff")
        void adminCanGetForeignDocument() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            assertThat(documentService.getDocument("doc-1", admin).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given Consultant mit Freigabe, When Dokument, Then Zugriff")
        void consultantWithShareCanGet() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(shareRepository.existsByDocumentAndSharedWith(ownDoc, consultant)).thenReturn(true);

            assertThat(documentService.getDocument("doc-1", consultant).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given Consultant ohne Freigabe, When fremdes Dokument, Then not found")
        void consultantWithoutShareCannotGet() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(shareRepository.existsByDocumentAndSharedWith(ownDoc, consultant)).thenReturn(false);

            assertThatThrownBy(() -> documentService.getDocument("doc-1", consultant))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("Download-Zugriffsprüfung (Leck geschlossen)")
    class DownloadTests {

        @Test
        @DisplayName("Given Consultant mit Freigabe, When Download, Then Dokument")
        void consultantWithShareCanDownload() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(shareRepository.existsByDocumentAndSharedWith(ownDoc, consultant)).thenReturn(true);

            assertThat(documentService.getDocumentForDownload("doc-1", consultant).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given Consultant ohne Freigabe, When Download, Then IllegalAccessError (403)")
        void consultantWithoutShareCannotDownload() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(shareRepository.existsByDocumentAndSharedWith(ownDoc, consultant)).thenReturn(false);

            assertThatThrownBy(() -> documentService.getDocumentForDownload("doc-1", consultant))
                    .isInstanceOf(IllegalAccessError.class);
        }
    }

    @Nested
    @DisplayName("Teilen (nur Admin) und Schreiben")
    class ShareAndWriteTests {

        @Test
        @DisplayName("Given Admin, When teilen, Then Freigabe angelegt")
        void adminSharesDocument() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(userRepository.findById("consultant-id")).thenReturn(Optional.of(consultant));
            when(shareRepository.existsByDocumentAndSharedWith(ownDoc, consultant)).thenReturn(false);

            documentService.shareDocument("doc-1", "consultant-id", admin);

            verify(shareRepository).save(any(DocumentShare.class));
            verify(activityLogService).log(eq(admin), eq("SHARE"), eq("DOCUMENT"), eq("doc-1"), any());
        }

        @Test
        @DisplayName("Given Consultant (nicht Eigentümer), When Beschreibung ändern, Then not found")
        void consultantCannotUpdateForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            assertThatThrownBy(() -> documentService.updateDocument("doc-1", "x", consultant))
                    .isInstanceOf(NoSuchElementException.class);
            verify(documentRepository, never()).save(any());
        }

        @Test
        @DisplayName("Given Consultant, When fremdes Dokument löschen, Then not found")
        void consultantCannotDeleteForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            assertThatThrownBy(() -> documentService.deleteDocument("doc-1", consultant))
                    .isInstanceOf(NoSuchElementException.class);
            verify(documentRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Given Consultant, When Upload in fremden Ordner, Then Zugriff verweigert")
        void consultantCannotUploadIntoForeignFolder() throws Exception {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            MultipartFile file = mock(MultipartFile.class);
            when(fileStorageService.store(file, "documents")).thenReturn("path");
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));

            assertThatThrownBy(() -> documentService.uploadDocument(file, "fld", null, consultant))
                    .isInstanceOf(IllegalAccessError.class);
            verify(documentRepository, never()).save(any());
        }
    }
}
