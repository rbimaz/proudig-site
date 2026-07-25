package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.DocumentDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
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
 * Unit Tests für DocumentService – Fokus auf die Team-Sicht des Personals
 * (ADMIN/CONSULTANT lesen alles) und die Admin-only-Verwaltung.
 */
@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock private DocumentRepository documentRepository;
    @Mock private FolderRepository folderRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks private DocumentService documentService;

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
    @DisplayName("Dokumente auflisten (Team-Sicht)")
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
        @DisplayName("Given Consultant, When Liste, Then alle Dokumente")
        void consultantSeesAllDocuments() {
            when(documentRepository.findAll()).thenReturn(List.of(ownDoc));

            assertThat(documentService.getDocumentsByUser(consultant)).hasSize(1);
        }

        @Test
        @DisplayName("Given Client, When Liste, Then nur eigene")
        void clientSeesOnlyOwn() {
            when(documentRepository.findByUploadedBy(client)).thenReturn(List.of());

            assertThat(documentService.getDocumentsByUser(client)).isEmpty();
            verify(documentRepository, never()).findAll();
        }

        @Test
        @DisplayName("Given Personal, When fremder Ordner, Then Dokumente erlaubt")
        void staffCanListForeignFolderDocuments() {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));
            when(documentRepository.findByFolder(folder)).thenReturn(List.of());

            assertThat(documentService.getDocumentsInFolder("fld", admin)).isEmpty();
        }

        @Test
        @DisplayName("Given Client, When fremder Ordner, Then Zugriff verweigert")
        void clientCannotListForeignFolderDocuments() {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));

            assertThatThrownBy(() -> documentService.getDocumentsInFolder("fld", client))
                    .isInstanceOf(IllegalAccessError.class);
        }
    }

    @Nested
    @DisplayName("Einzeldokument abrufen")
    class GetTests {

        @Test
        @DisplayName("Given Personal, When fremdes Dokument, Then via findById")
        void staffCanGetForeignDocument() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            DocumentDto d = documentService.getDocument("doc-1", admin);

            assertThat(d.getId()).isEqualTo("doc-1");
            verify(documentRepository, never()).findByIdAndUploadedBy(any(), any());
        }

        @Test
        @DisplayName("Given Client, When fremdes Dokument, Then not found")
        void clientCannotGetForeignDocument() {
            when(documentRepository.findByIdAndUploadedBy("doc-1", client)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> documentService.getDocument("doc-1", client))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("Verwaltung nur für Admin")
    class ManageTests {

        @Test
        @DisplayName("Given Admin, When fremde Beschreibung ändern, Then ok")
        void adminCanUpdateForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));
            when(documentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            DocumentDto d = documentService.updateDocument("doc-1", "neu", admin);

            assertThat(d.getDescription()).isEqualTo("neu");
        }

        @Test
        @DisplayName("Given Consultant, When fremde Beschreibung ändern, Then not found")
        void consultantCannotUpdateForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            assertThatThrownBy(() -> documentService.updateDocument("doc-1", "x", consultant))
                    .isInstanceOf(NoSuchElementException.class);
            verify(documentRepository, never()).save(any());
        }

        @Test
        @DisplayName("Given Admin, When fremdes Dokument löschen, Then gelöscht")
        void adminCanDeleteForeign() {
            when(documentRepository.findById("doc-1")).thenReturn(Optional.of(ownDoc));

            documentService.deleteDocument("doc-1", admin);

            verify(documentRepository).delete(ownDoc);
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
        @DisplayName("Given Admin, When Upload in fremden Ordner, Then ok")
        void adminCanUploadIntoForeignFolder() throws Exception {
            Folder folder = Folder.builder().id("fld").owner(owner).build();
            MultipartFile file = mock(MultipartFile.class);
            when(file.getOriginalFilename()).thenReturn("a.pdf");
            when(fileStorageService.store(file, "documents")).thenReturn("path");
            when(folderRepository.findById("fld")).thenReturn(Optional.of(folder));
            when(documentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            DocumentDto d = documentService.uploadDocument(file, "fld", null, admin);

            assertThat(d.getFolderId()).isEqualTo("fld");
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
