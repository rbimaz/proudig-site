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
 * Unit Tests für DocumentService – zentrale Zugriffsprüfung über PortalAccessService
 * (Ordner-vererbte Berechtigungen); Listen-/Teilen-Verhalten unverändert.
 */
@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock private DocumentRepository documentRepository;
    @Mock private FolderRepository folderRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private ActivityLogService activityLogService;
    @Mock private DocumentShareRepository shareRepository;
    @Mock private UserRepository userRepository;
    @Mock private PortalAccessService access;

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
        @DisplayName("Given ohne Ordner-Lesezugriff, When fremder Ordner, Then Zugriff verweigert")
        void cannotListForeignFolderDocuments() {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));
            when(access.canRead(consultant, folder)).thenReturn(false);

            assertThatThrownBy(() -> documentService.getDocumentsInFolder("fld", consultant))
                    .isInstanceOf(IllegalAccessError.class);
        }
    }

    @Nested
    @DisplayName("Einzeldokument abrufen (canAccess)")
    class GetTests {

        @Test
        @DisplayName("Given Zugriff (Admin/Freigabe), When Dokument, Then Zugriff")
        void canGetWithAccess() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(access.canReadDocument(admin, ownDoc)).thenReturn(true);

            assertThat(documentService.getDocument("doc-1", admin).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given kein Zugriff, When fremdes Dokument, Then not found")
        void withoutAccessCannotGet() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(access.canReadDocument(consultant, ownDoc)).thenReturn(false);

            assertThatThrownBy(() -> documentService.getDocument("doc-1", consultant))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("Download-Zugriffsprüfung (Leck geschlossen)")
    class DownloadTests {

        @Test
        @DisplayName("Given Zugriff, When Download, Then Dokument")
        void withAccessCanDownload() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(access.canReadDocument(consultant, ownDoc)).thenReturn(true);

            assertThat(documentService.getDocumentForDownload("doc-1", consultant).getId()).isEqualTo("doc-1");
        }

        @Test
        @DisplayName("Given kein Zugriff, When Download, Then IllegalAccessError (403)")
        void withoutAccessCannotDownload() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(access.canReadDocument(consultant, ownDoc)).thenReturn(false);

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
        @DisplayName("Given kein Schreibrecht, When fremdes Dokument löschen, Then not found")
        void cannotDeleteForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(access.canModifyDocument(consultant, ownDoc)).thenReturn(false);

            assertThatThrownBy(() -> documentService.deleteDocument("doc-1", consultant))
                    .isInstanceOf(NoSuchElementException.class);
            verify(documentRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Given kein Schreibrecht auf Ordner, When Upload in fremden Ordner, Then verweigert")
        void cannotUploadIntoForeignFolder() throws Exception {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            MultipartFile file = mock(MultipartFile.class);
            when(fileStorageService.store(file, "documents")).thenReturn("path");
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));
            when(access.canWrite(consultant, folder)).thenReturn(false);

            assertThatThrownBy(() -> documentService.uploadDocument(file, "fld", null, consultant))
                    .isInstanceOf(IllegalAccessError.class);
            verify(documentRepository, never()).save(any());
        }

        @Test
        @DisplayName("Given WRITE auf Ordner, When Datei-Inhalt aktualisieren, Then ersetzt")
        void writeGranteeUpdatesContent() throws Exception {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            Document doc = Document.builder().id("doc-2").fileName("x.pdf").storagePath("old").uploadedBy(owner).folder(folder).build();
            MultipartFile file = mock(MultipartFile.class);
            when(documentRepository.findById("doc-2")).thenReturn(Optional.of(doc));
            when(access.canUpdateDocumentContent(consultant, doc)).thenReturn(true);
            when(fileStorageService.store(file, "documents")).thenReturn("new");
            when(file.getSize()).thenReturn(123L);
            when(file.getContentType()).thenReturn("application/pdf");
            when(documentRepository.save(any(Document.class))).thenAnswer(i -> i.getArgument(0));

            DocumentDto result = documentService.updateDocumentContent("doc-2", file, consultant);

            assertThat(result.getStoragePath()).isEqualTo("new");
            assertThat(result.getFileSize()).isEqualTo(123L);
            verify(fileStorageService).delete("old", "documents");
            verify(activityLogService).log(eq(consultant), eq("UPDATE"), eq("DOCUMENT"), eq("doc-2"), any());
        }
    }
}
