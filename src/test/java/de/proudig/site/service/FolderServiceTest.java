package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.FolderDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Tests für FolderService
 *
 * Testet die Funktionalität zum Umbenennen und Löschen von Ordnern
 * inklusive Admin-Berechtigung und rekursivem Löschen.
 */
@ExtendWith(MockitoExtension.class)
class FolderServiceTest {

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private FolderService folderService;

    private User owner;
    private User admin;
    private User otherUser;
    private Role adminRole;
    private Folder testFolder;

    @BeforeEach
    void setUp() {
        adminRole = new Role();
        adminRole.setId(1L);
        adminRole.setName("ADMIN");

        owner = new User();
        owner.setId("owner-id");
        owner.setEmail("owner@test.de");
        owner.setRoles(new HashSet<>());

        admin = new User();
        admin.setId("admin-id");
        admin.setEmail("admin@test.de");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));

        otherUser = new User();
        otherUser.setId("other-id");
        otherUser.setEmail("other@test.de");
        otherUser.setRoles(new HashSet<>());

        testFolder = Folder.builder()
                .id("folder-id")
                .name("Test Folder")
                .owner(owner)
                .build();
    }

    @Nested
    @DisplayName("Ordner umbenennen")
    class UpdateFolderTests {

        @Test
        @DisplayName("Given Ordner existiert, When Owner umbenennt, Then Name wird geändert")
        void ownerCanRenameFolder() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(any())).thenReturn(0L);
            when(documentRepository.countByFolder(any())).thenReturn(0L);

            // When
            FolderDto result = folderService.updateFolder("folder-id", "Neuer Name", owner);

            // Then
            assertThat(result.getName()).isEqualTo("Neuer Name");
            verify(folderRepository).save(testFolder);
        }

        @Test
        @DisplayName("Given Ordner gehört anderem User, When Admin umbenennt, Then Name wird geändert")
        void adminCanRenameFolderOfOtherUser() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(any())).thenReturn(0L);
            when(documentRepository.countByFolder(any())).thenReturn(0L);

            // When
            FolderDto result = folderService.updateFolder("folder-id", "Admin-Rename", admin);

            // Then
            assertThat(result.getName()).isEqualTo("Admin-Rename");
        }

        @Test
        @DisplayName("Given Ordner gehört anderem User, When normaler User umbenennt, Then AccessDenied")
        void otherUserCannotRenameFolder() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));

            // When/Then
            assertThatThrownBy(() -> folderService.updateFolder("folder-id", "Hack", otherUser))
                    .isInstanceOf(IllegalAccessError.class)
                    .hasMessageContaining("Access denied");
        }

        @Test
        @DisplayName("Given leerer Name, When umbenennen, Then IllegalArgumentException")
        void emptyNameThrowsException() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));

            // When/Then
            assertThatThrownBy(() -> folderService.updateFolder("folder-id", "", owner))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("cannot be empty");
        }

        @Test
        @DisplayName("Given null Name, When umbenennen, Then IllegalArgumentException")
        void nullNameThrowsException() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));

            // When/Then
            assertThatThrownBy(() -> folderService.updateFolder("folder-id", null, owner))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("cannot be empty");
        }

        @Test
        @DisplayName("Given Ordner nicht gefunden, When umbenennen, Then NoSuchElementException")
        void folderNotFoundThrowsException() {
            // Given
            when(folderRepository.findById("unknown")).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> folderService.updateFolder("unknown", "Name", owner))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("Ordner löschen")
    class DeleteFolderTests {

        @Test
        @DisplayName("Given leerer Ordner, When Owner löscht, Then Ordner wird gelöscht")
        void ownerCanDeleteEmptyFolder() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of());

            // When
            folderService.deleteFolder("folder-id", owner);

            // Then
            verify(folderRepository).delete(testFolder);
        }

        @Test
        @DisplayName("Given Ordner gehört anderem User, When Admin löscht, Then Ordner wird gelöscht")
        void adminCanDeleteFolderOfOtherUser() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of());

            // When
            folderService.deleteFolder("folder-id", admin);

            // Then
            verify(folderRepository).delete(testFolder);
        }

        @Test
        @DisplayName("Given Ordner gehört anderem User, When normaler User löscht, Then AccessDenied")
        void otherUserCannotDeleteFolder() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));

            // When/Then
            assertThatThrownBy(() -> folderService.deleteFolder("folder-id", otherUser))
                    .isInstanceOf(IllegalAccessError.class)
                    .hasMessageContaining("Access denied");

            verify(folderRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Given Ordner mit Dokumenten, When löschen, Then Dokumente werden auch gelöscht")
        void deleteFolderDeletesDocuments() {
            // Given
            Document doc1 = Document.builder().id("doc-1").fileName("file1.pdf").build();
            Document doc2 = Document.builder().id("doc-2").fileName("file2.pdf").build();

            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of(doc1, doc2));

            // When
            folderService.deleteFolder("folder-id", owner);

            // Then
            ArgumentCaptor<List<Document>> captor = ArgumentCaptor.forClass(List.class);
            verify(documentRepository).deleteAll(captor.capture());
            assertThat(captor.getValue()).hasSize(2);
            verify(folderRepository).delete(testFolder);
        }

        @Test
        @DisplayName("Given Ordner mit Unterordner, When löschen, Then rekursiv gelöscht")
        void deleteFolderDeletesSubfoldersRecursively() {
            // Given
            Folder childFolder = Folder.builder()
                    .id("child-folder-id")
                    .name("Child Folder")
                    .owner(owner)
                    .parentFolder(testFolder)
                    .build();

            Document childDoc = Document.builder().id("child-doc").fileName("child.pdf").build();

            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of(childFolder));
            when(folderRepository.findByParentFolder(childFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(childFolder)).thenReturn(List.of(childDoc));

            // When
            folderService.deleteFolder("folder-id", owner);

            // Then
            verify(folderRepository).delete(childFolder);
            verify(folderRepository).delete(testFolder);
            verify(documentRepository).deleteAll(List.of(childDoc));
        }

        @Test
        @DisplayName("Given Ordner nicht gefunden, When löschen, Then NoSuchElementException")
        void folderNotFoundThrowsException() {
            // Given
            when(folderRepository.findById("unknown")).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> folderService.deleteFolder("unknown", owner))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("mapToDto")
    class MapToDtoTests {

        @Test
        @DisplayName("Given Ordner mit Inhalten, When mapToDto, Then Zähler korrekt")
        void mapToDtoIncludesCounters() {
            // Given
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(testFolder)).thenReturn(3L);
            when(documentRepository.countByFolder(testFolder)).thenReturn(5L);

            // When
            FolderDto result = folderService.updateFolder("folder-id", "Updated", owner);

            // Then
            assertThat(result.getChildFolderCount()).isEqualTo(3);
            assertThat(result.getDocumentCount()).isEqualTo(5);
            assertThat(result.isHasChildren()).isTrue();
        }
    }

    @Nested
    @DisplayName("Ordner verschieben")
    class MoveFolderTests {

        @Test
        @DisplayName("Given eigener Ordner und Ziel, When verschoben, Then parentFolder = Ziel")
        void ownerCanMoveFolderIntoTarget() {
            Folder target = Folder.builder().id("target-id").name("Ziel").owner(owner).build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findById("target-id")).thenReturn(Optional.of(target));
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(any())).thenReturn(0L);
            when(documentRepository.countByFolder(any())).thenReturn(0L);

            FolderDto result = folderService.moveFolder("folder-id", "target-id", owner);

            assertThat(testFolder.getParentFolder()).isEqualTo(target);
            assertThat(result.getParentFolderId()).isEqualTo("target-id");
        }

        @Test
        @DisplayName("Given Unterordner, When auf Wurzel verschoben, Then parentFolder = null")
        void moveToRoot() {
            testFolder.setParentFolder(Folder.builder().id("old-parent").owner(owner).build());
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(any())).thenReturn(0L);
            when(documentRepository.countByFolder(any())).thenReturn(0L);

            FolderDto result = folderService.moveFolder("folder-id", null, owner);

            assertThat(testFolder.getParentFolder()).isNull();
            assertThat(result.getParentFolderId()).isNull();
        }

        @Test
        @DisplayName("Given Ziel ist Nachfahre, When verschoben, Then IllegalArgumentException")
        void cannotMoveIntoDescendant() {
            // target ist Kind von testFolder -> Zyklus
            Folder target = Folder.builder().id("target-id").name("Kind").owner(owner)
                    .parentFolder(testFolder).build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findById("target-id")).thenReturn(Optional.of(target));

            assertThatThrownBy(() -> folderService.moveFolder("folder-id", "target-id", owner))
                    .isInstanceOf(IllegalArgumentException.class);

            verify(folderRepository, never()).save(any(Folder.class));
        }

        @Test
        @DisplayName("Given fremder Ordner, When Nicht-Admin verschiebt, Then Zugriff verweigert")
        void nonOwnerCannotMove() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));

            assertThatThrownBy(() -> folderService.moveFolder("folder-id", null, otherUser))
                    .isInstanceOf(IllegalAccessError.class);

            verify(folderRepository, never()).save(any(Folder.class));
        }
    }
}
