package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.FolderDto;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
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
 * Unit Tests für FolderService – Zugriff über zentrale {@link PortalAccessService}.
 * Owner/ADMIN entsprechen FULL; Fremde ohne Freigabe NONE.
 */
@ExtendWith(MockitoExtension.class)
class FolderServiceTest {

    @Mock private FolderRepository folderRepository;
    @Mock private DocumentRepository documentRepository;
    @Mock private FolderShareRepository folderShareRepository;
    @Mock private UserGroupRepository userGroupRepository;
    @Mock private PortalAccessService access;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks private FolderService folderService;

    private User owner;
    private User admin;
    private User consultant;
    private User otherUser;
    private Folder testFolder;

    @BeforeEach
    void setUp() {
        Role adminRole = new Role();
        adminRole.setId(1L);
        adminRole.setName("ADMIN");

        Role consultantRole = new Role();
        consultantRole.setId(2L);
        consultantRole.setName("CONSULTANT");

        owner = new User();
        owner.setId("owner-id");
        owner.setRoles(new HashSet<>());

        admin = new User();
        admin.setId("admin-id");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));

        consultant = new User();
        consultant.setId("consultant-id");
        consultant.setRoles(new HashSet<>(Set.of(consultantRole)));

        otherUser = new User();
        otherUser.setId("other-id");
        otherUser.setRoles(new HashSet<>());

        testFolder = Folder.builder().id("folder-id").name("Test Folder").owner(owner).build();

        // mapToDto/Kontext-Hilfsstubs (nicht in jedem Test genutzt)
        lenient().when(access.contextFor(any())).thenReturn(new PortalAccessService.AccessContext(false, "x", Map.of()));
        lenient().when(folderShareRepository.findByFolderIn(any())).thenReturn(List.of());
        lenient().when(folderRepository.countByParentFolder(any())).thenReturn(0L);
        lenient().when(documentRepository.countByFolder(any())).thenReturn(0L);
    }

    @Nested
    @DisplayName("Ordner umbenennen")
    class UpdateFolderTests {

        @Test
        @DisplayName("Owner (FULL) benennt um")
        void ownerCanRenameFolder() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));

            FolderDto result = folderService.updateFolder("folder-id", "Neuer Name", owner);

            assertThat(result.getName()).isEqualTo("Neuer Name");
            verify(folderRepository).save(testFolder);
        }

        @Test
        @DisplayName("Admin (FULL) benennt fremden Ordner um")
        void adminCanRenameForeign() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(admin, testFolder)).thenReturn(true);
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));

            FolderDto result = folderService.updateFolder("folder-id", "Admin-Rename", admin);

            assertThat(result.getName()).isEqualTo("Admin-Rename");
        }

        @Test
        @DisplayName("Ohne FULL, When umbenennen, Then AccessDenied")
        void otherUserCannotRename() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(otherUser, testFolder)).thenReturn(false);

            assertThatThrownBy(() -> folderService.updateFolder("folder-id", "Hack", otherUser))
                    .isInstanceOf(IllegalAccessError.class);
        }

        @Test
        @DisplayName("Leerer Name, Then IllegalArgumentException")
        void emptyNameThrows() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);

            assertThatThrownBy(() -> folderService.updateFolder("folder-id", "", owner))
                    .isInstanceOf(IllegalArgumentException.class);
        }

        @Test
        @DisplayName("Ordner nicht gefunden, Then NoSuchElementException")
        void notFoundThrows() {
            when(folderRepository.findById("unknown")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> folderService.updateFolder("unknown", "Name", owner))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }

    @Nested
    @DisplayName("Ordner löschen")
    class DeleteFolderTests {

        @Test
        @DisplayName("Owner (FULL) löscht leeren Ordner")
        void ownerCanDeleteEmpty() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of());

            folderService.deleteFolder("folder-id", owner);

            verify(folderRepository).delete(testFolder);
        }

        @Test
        @DisplayName("Ohne FULL, Then AccessDenied")
        void otherUserCannotDelete() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(otherUser, testFolder)).thenReturn(false);

            assertThatThrownBy(() -> folderService.deleteFolder("folder-id", otherUser))
                    .isInstanceOf(IllegalAccessError.class);
            verify(folderRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Ordner mit Dokumenten, Then Dokumente auch gelöscht")
        void deleteAlsoDocuments() {
            Document doc1 = Document.builder().id("doc-1").fileName("file1.pdf").build();
            Document doc2 = Document.builder().id("doc-2").fileName("file2.pdf").build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of(doc1, doc2));

            folderService.deleteFolder("folder-id", owner);

            ArgumentCaptor<List<Document>> captor = ArgumentCaptor.forClass(List.class);
            verify(documentRepository).deleteAll(captor.capture());
            assertThat(captor.getValue()).hasSize(2);
            verify(folderRepository).delete(testFolder);
        }

        @Test
        @DisplayName("Ordner mit Unterordner, Then rekursiv gelöscht")
        void deleteRecursively() {
            Folder childFolder = Folder.builder().id("child").name("Child").owner(owner).parentFolder(testFolder).build();
            Document childDoc = Document.builder().id("child-doc").fileName("child.pdf").build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of(childFolder));
            when(folderRepository.findByParentFolder(childFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(testFolder)).thenReturn(List.of());
            when(documentRepository.findByFolder(childFolder)).thenReturn(List.of(childDoc));

            folderService.deleteFolder("folder-id", owner);

            verify(folderRepository).delete(childFolder);
            verify(folderRepository).delete(testFolder);
            verify(documentRepository).deleteAll(List.of(childDoc));
        }
    }

    @Nested
    @DisplayName("Ordner auflisten (Team-Sicht + virtuelle Roots)")
    class ListFolderTests {

        @Test
        @DisplayName("Admin sieht alle Root-Ordner")
        void adminSeesAllRoots() {
            Folder foreign = Folder.builder().id("f2").name("Fremd").owner(otherUser).build();
            when(folderRepository.findByParentFolderIsNull()).thenReturn(List.of(testFolder, foreign));

            List<FolderDto> result = folderService.getRootFolders(admin);

            assertThat(result).hasSize(2);
            verify(folderRepository, never()).findByOwnerAndParentFolderIsNull(any());
        }

        @Test
        @DisplayName("Consultant sieht eigene Roots (+ geteilte)")
        void consultantSeesOwnRoots() {
            when(folderRepository.findByOwnerAndParentFolderIsNull(consultant)).thenReturn(List.of(testFolder));
            when(userGroupRepository.findByMembersContains(consultant)).thenReturn(List.of());
            when(folderShareRepository.findBySharedWithUserOrSharedWithGroupIn(eq(consultant), anyList())).thenReturn(List.of());

            List<FolderDto> result = folderService.getRootFolders(consultant);

            assertThat(result).hasSize(1);
            verify(folderRepository, never()).findByParentFolderIsNull();
        }

        @Test
        @DisplayName("Lesezugriff auf Unterordner erlaubt (canRead)")
        void canListSubfoldersWithRead() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canRead(admin, testFolder)).thenReturn(true);
            when(folderRepository.findByParentFolder(testFolder)).thenReturn(List.of());

            assertThat(folderService.getSubFolders("folder-id", admin)).isEmpty();
        }

        @Test
        @DisplayName("Kein Lesezugriff auf Unterordner, Then AccessDenied")
        void cannotListSubfoldersWithoutRead() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canRead(otherUser, testFolder)).thenReturn(false);

            assertThatThrownBy(() -> folderService.getSubFolders("folder-id", otherUser))
                    .isInstanceOf(IllegalAccessError.class);
        }

        @Test
        @DisplayName("getFolderById mit Lesezugriff")
        void getByIdWithRead() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canRead(admin, testFolder)).thenReturn(true);

            assertThat(folderService.getFolderById("folder-id", admin).getId()).isEqualTo("folder-id");
        }
    }

    @Nested
    @DisplayName("mapToDto")
    class MapToDtoTests {

        @Test
        @DisplayName("Zähler und shared-Flag")
        void mapToDtoCounters() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canDeleteFolder(owner, testFolder)).thenReturn(true);
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));
            when(folderRepository.countByParentFolder(testFolder)).thenReturn(3L);
            when(documentRepository.countByFolder(testFolder)).thenReturn(5L);

            FolderDto result = folderService.updateFolder("folder-id", "Updated", owner);

            assertThat(result.getChildFolderCount()).isEqualTo(3);
            assertThat(result.getDocumentCount()).isEqualTo(5);
            assertThat(result.isHasChildren()).isTrue();
            assertThat(result.isShared()).isFalse();
        }
    }

    @Nested
    @DisplayName("Ordner verschieben")
    class MoveFolderTests {

        @Test
        @DisplayName("In Ziel verschieben (canMoveFolder)")
        void moveIntoTarget() {
            Folder target = Folder.builder().id("target-id").name("Ziel").owner(owner).build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findById("target-id")).thenReturn(Optional.of(target));
            when(access.canMoveFolder(owner, testFolder, target)).thenReturn(true);
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));

            FolderDto result = folderService.moveFolder("folder-id", "target-id", owner);

            assertThat(testFolder.getParentFolder()).isEqualTo(target);
            assertThat(result.getParentFolderId()).isEqualTo("target-id");
        }

        @Test
        @DisplayName("Auf Wurzel verschieben")
        void moveToRoot() {
            testFolder.setParentFolder(Folder.builder().id("old-parent").owner(owner).build());
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canMoveFolder(owner, testFolder, null)).thenReturn(true);
            when(folderRepository.save(any(Folder.class))).thenAnswer(i -> i.getArgument(0));

            FolderDto result = folderService.moveFolder("folder-id", null, owner);

            assertThat(testFolder.getParentFolder()).isNull();
            assertThat(result.getParentFolderId()).isNull();
        }

        @Test
        @DisplayName("Ziel ist Nachfahre, Then IllegalArgumentException (vor Access)")
        void cannotMoveIntoDescendant() {
            Folder target = Folder.builder().id("target-id").name("Kind").owner(owner).parentFolder(testFolder).build();
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(folderRepository.findById("target-id")).thenReturn(Optional.of(target));

            assertThatThrownBy(() -> folderService.moveFolder("folder-id", "target-id", owner))
                    .isInstanceOf(IllegalArgumentException.class);
            verify(folderRepository, never()).save(any(Folder.class));
        }

        @Test
        @DisplayName("Ohne Berechtigung, Then AccessDenied")
        void cannotMoveWithoutPermission() {
            when(folderRepository.findById("folder-id")).thenReturn(Optional.of(testFolder));
            when(access.canMoveFolder(otherUser, testFolder, null)).thenReturn(false);

            assertThatThrownBy(() -> folderService.moveFolder("folder-id", null, otherUser))
                    .isInstanceOf(IllegalAccessError.class);
            verify(folderRepository, never()).save(any(Folder.class));
        }
    }
}
