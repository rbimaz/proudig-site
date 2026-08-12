package de.proudig.site.service;

import de.proudig.site.domain.*;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

/**
 * Sicherheitskritische Autorisierungs-Matrix für {@link PortalAccessService}:
 * Rolle × Quelle (Eigentum/ADMIN/User-/Gruppen-Share) × Aktion × eigen/fremd ×
 * Wurzel/Teilbaum, inkl. Union und Vererbung über mehrere Ebenen.
 */
@ExtendWith(MockitoExtension.class)
class PortalAccessServiceTest {

    @Mock private FolderShareRepository folderShareRepository;
    @Mock private UserGroupRepository userGroupRepository;
    @Mock private DocumentShareRepository documentShareRepository;

    @InjectMocks private PortalAccessService access;

    private User admin;
    private User owner;
    private User grantee;   // Consultant, erhält Freigaben
    private User stranger;  // ohne jede Beziehung
    private UserGroup group;

    private Folder root;    // owner=owner
    private Folder sub;     // parent=root, owner=owner
    private Folder granteeSub; // parent=root, owner=grantee (selbst angelegt)

    @BeforeEach
    void setUp() {
        Role adminRole = new Role();
        adminRole.setName("ADMIN");
        Role consultantRole = new Role();
        consultantRole.setName("CONSULTANT");

        admin = user("admin-id", adminRole);
        owner = user("owner-id", consultantRole);
        grantee = user("grantee-id", consultantRole);
        stranger = user("stranger-id", consultantRole);

        group = new UserGroup();
        group.setId("group-id");
        group.setName("Team");
        group.setMembers(new HashSet<>(Set.of(grantee)));

        root = Folder.builder().id("root").name("Root").owner(owner).build();
        sub = Folder.builder().id("sub").name("Sub").owner(owner).parentFolder(root).build();
        granteeSub = Folder.builder().id("gsub").name("GSub").owner(grantee).parentFolder(root).build();
    }

    private User user(String id, Role role) {
        User u = new User();
        u.setId(id);
        u.setRoles(new HashSet<>(Set.of(role)));
        return u;
    }

    private FolderShare share(Folder folder, SharePermission perm, User u, UserGroup g) {
        FolderShare s = new FolderShare();
        s.setId("share-" + folder.getId());
        s.setFolder(folder);
        s.setPermission(perm);
        s.setSharedWithUser(u);
        s.setSharedWithGroup(g);
        return s;
    }

    @Nested
    @DisplayName("Ordner-Berechtigung (effectivePermission)")
    class FolderPermission {

        @Test
        @DisplayName("ADMIN hat FULL auf jeden Ordner")
        void adminFull() {
            assertThat(access.effectivePermission(admin, sub)).isEqualTo(PortalAccessService.AccessLevel.FULL);
        }

        @Test
        @DisplayName("Eigentümer hat FULL")
        void ownerFull() {
            lenient().when(userGroupRepository.findByMembersContains(owner)).thenReturn(List.of());
            assertThat(access.effectivePermission(owner, root)).isEqualTo(PortalAccessService.AccessLevel.FULL);
        }

        @Test
        @DisplayName("Eigentum am Vorfahren ⇒ FULL auf Nachfahren")
        void ownerOfAncestorFull() {
            lenient().when(userGroupRepository.findByMembersContains(owner)).thenReturn(List.of());
            assertThat(access.effectivePermission(owner, sub)).isEqualTo(PortalAccessService.AccessLevel.FULL);
        }

        @Test
        @DisplayName("Keine Beziehung ⇒ NONE")
        void strangerNone() {
            when(userGroupRepository.findByMembersContains(stranger)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(sub)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of());
            assertThat(access.effectivePermission(stranger, sub)).isEqualTo(PortalAccessService.AccessLevel.NONE);
            assertThat(access.canRead(stranger, sub)).isFalse();
        }

        @Test
        @DisplayName("User-Share READ ⇒ READ (lesen ja, schreiben nein)")
        void userShareRead() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.READ, grantee, null)));
            assertThat(access.effectivePermission(grantee, root)).isEqualTo(PortalAccessService.AccessLevel.READ);
            assertThat(access.canRead(grantee, root)).isTrue();
            assertThat(access.canWrite(grantee, root)).isFalse();
        }

        @Test
        @DisplayName("Gruppen-Share WRITE (Nutzer Mitglied) ⇒ WRITE")
        void groupShareWrite() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of(group));
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.WRITE, null, group)));
            assertThat(access.effectivePermission(grantee, root)).isEqualTo(PortalAccessService.AccessLevel.WRITE);
            assertThat(access.canWrite(grantee, root)).isTrue();
        }

        @Test
        @DisplayName("Union: User-READ + Gruppen-WRITE ⇒ WRITE")
        void unionReadWrite() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of(group));
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(
                    share(root, SharePermission.READ, grantee, null),
                    share(root, SharePermission.WRITE, null, group)));
            assertThat(access.effectivePermission(grantee, root)).isEqualTo(PortalAccessService.AccessLevel.WRITE);
        }

        @Test
        @DisplayName("Vererbung: Share auf Vorfahr wirkt auf Nachfahren")
        void inheritedFromAncestor() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(sub)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.WRITE, grantee, null)));
            assertThat(access.canWrite(grantee, sub)).isTrue();
        }
    }

    @Nested
    @DisplayName("Löschen/Verschieben von Ordnern")
    class FolderMutation {

        @Test
        @DisplayName("WRITE-Empfänger kann geteilten Wurzelordner NICHT löschen")
        void writeGranteeCannotDeleteSharedRoot() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.WRITE, grantee, null)));
            assertThat(access.canDeleteFolder(grantee, root)).isFalse();
        }

        @Test
        @DisplayName("WRITE-Empfänger kann selbst angelegten Unterordner löschen (Owner ⇒ FULL)")
        void writeGranteeCanDeleteOwnSub() {
            lenient().when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            assertThat(access.canDeleteFolder(grantee, granteeSub)).isTrue();
        }

        @Test
        @DisplayName("Verschieben des eigenen Unterordners innerhalb WRITE-Teilbaums erlaubt")
        void moveOwnSubWithinWriteSubtree() {
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            // Ziel = sub (fremd), grantee hat WRITE über root-Share
            when(folderShareRepository.findByFolder(sub)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.WRITE, grantee, null)));
            assertThat(access.canMoveFolder(grantee, granteeSub, sub)).isTrue();
        }

        @Test
        @DisplayName("Verschieben auf Wurzel durch Empfänger verweigert (verlässt Teilbaum)")
        void moveToRootDeniedForGrantee() {
            lenient().when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            assertThat(access.canMoveFolder(grantee, granteeSub, null)).isFalse();
        }
    }

    @Nested
    @DisplayName("Dokument-Zugriff")
    class DocumentAccess {

        private Document docByOwner() {
            return Document.builder().id("d1").fileName("f.pdf").uploadedBy(owner).folder(root).build();
        }

        @Test
        @DisplayName("Lesen über Ordner-READ-Freigabe")
        void readViaFolderShare() {
            Document doc = docByOwner();
            when(documentShareRepository.existsByDocumentAndSharedWith(doc, grantee)).thenReturn(false);
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.READ, grantee, null)));
            assertThat(access.canReadDocument(grantee, doc)).isTrue();
        }

        @Test
        @DisplayName("WRITE-Empfänger darf fremde Datei aktualisieren, aber nicht löschen")
        void updateYesDeleteNoForForeignFile() {
            Document doc = docByOwner();
            when(userGroupRepository.findByMembersContains(grantee)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of(share(root, SharePermission.WRITE, grantee, null)));
            assertThat(access.canUpdateDocumentContent(grantee, doc)).isTrue();
            assertThat(access.canModifyDocument(grantee, doc)).isFalse();
        }

        @Test
        @DisplayName("WRITE-Empfänger darf eigene hochgeladene Datei löschen")
        void deleteOwnUploadedFile() {
            Document own = Document.builder().id("d2").fileName("own.pdf").uploadedBy(grantee).folder(root).build();
            assertThat(access.canModifyDocument(grantee, own)).isTrue();
        }

        @Test
        @DisplayName("Reiner Fremd-Zugriff ohne Freigabe ⇒ kein Lesen")
        void noAccessNoRead() {
            Document doc = docByOwner();
            when(documentShareRepository.existsByDocumentAndSharedWith(doc, stranger)).thenReturn(false);
            when(userGroupRepository.findByMembersContains(stranger)).thenReturn(List.of());
            when(folderShareRepository.findByFolder(root)).thenReturn(List.of());
            assertThat(access.canReadDocument(stranger, doc)).isFalse();
        }
    }
}
