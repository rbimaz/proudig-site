package de.proudig.site.service;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.FolderShare;
import de.proudig.site.domain.SharePermission;
import de.proudig.site.domain.User;
import de.proudig.site.domain.UserGroup;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.FolderShareRepository;
import de.proudig.site.repository.UserGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Zentrale, autoritative Zugriffsprüfung für Ordner und Dokumente.
 *
 * <p>Die effektive Berechtigung auf einen Ordner ergibt sich als Union
 * („großzügigste gewinnt") aus: ADMIN (voll), Eigentum an dem Ordner oder einem
 * Vorfahren (voll), sowie READ/WRITE-Freigaben an den Nutzer oder eine seiner
 * Gruppen auf dem Ordner oder einem Vorfahren. Sicherheitskritisch — einzige
 * Quelle der Wahrheit; kein Enforcement in Controllern duplizieren.
 */
@Service
public class PortalAccessService {

    /** Stufen aufsteigend nach Mächtigkeit (ordinal für max()). */
    public enum AccessLevel {
        NONE, READ, WRITE, FULL
    }

    private final FolderShareRepository folderShareRepository;
    private final UserGroupRepository userGroupRepository;
    private final DocumentShareRepository documentShareRepository;

    public PortalAccessService(FolderShareRepository folderShareRepository,
                               UserGroupRepository userGroupRepository,
                               DocumentShareRepository documentShareRepository) {
        this.folderShareRepository = folderShareRepository;
        this.userGroupRepository = userGroupRepository;
        this.documentShareRepository = documentShareRepository;
    }

    // ---------- Ordner ----------

    /** Effektive Berechtigung des Nutzers auf den Ordner (Vorfahren-Walk, Union). */
    @Transactional(readOnly = true)
    public AccessLevel effectivePermission(User user, Folder folder) {
        if (isAdmin(user)) {
            return AccessLevel.FULL;
        }
        List<UserGroup> groups = userGroupRepository.findByMembersContains(user);
        AccessLevel best = AccessLevel.NONE;
        for (Folder cursor = folder; cursor != null; cursor = cursor.getParentFolder()) {
            if (cursor.getOwner().getId().equals(user.getId())) {
                return AccessLevel.FULL;
            }
            for (FolderShare share : folderShareRepository.findByFolder(cursor)) {
                if (shareApplies(share, user, groups)) {
                    AccessLevel lvl = share.getPermission() == SharePermission.WRITE
                            ? AccessLevel.WRITE : AccessLevel.READ;
                    best = max(best, lvl);
                }
            }
        }
        return best;
    }

    /** Browsen/Download im Ordner-Teilbaum. */
    public boolean canRead(User user, Folder folder) {
        return atLeast(effectivePermission(user, folder), AccessLevel.READ);
    }

    /** Hochladen / Unterordner anlegen / vorhandene Dateien aktualisieren im Ordner. */
    public boolean canWrite(User user, Folder folder) {
        return atLeast(effectivePermission(user, folder), AccessLevel.WRITE);
    }

    /**
     * Ordner löschen/umbenennen. Nur FULL — d. h. ADMIN, Eigentümer oder ein
     * selbst (als Owner) angelegter Unterordner im WRITE-Teilbaum (Owner ⇒ FULL);
     * der geteilte Wurzel-/fremde Ordner ist NICHT löschbar (nur WRITE geerbt).
     */
    public boolean canDeleteFolder(User user, Folder folder) {
        return effectivePermission(user, folder) == AccessLevel.FULL;
    }

    /**
     * Ordner verschieben: FULL auf dem Ordner selbst; das Ziel muss beschreibbar
     * sein (bzw. Root nur für ADMIN/eigenen Baum) — kein Verlassen des erlaubten
     * Bereichs.
     */
    public boolean canMoveFolder(User user, Folder folder, Folder target) {
        if (effectivePermission(user, folder) != AccessLevel.FULL) {
            return false;
        }
        if (target == null) {
            return isAdmin(user) || ownsRootAncestor(user, folder);
        }
        return canWrite(user, target);
    }

    // ---------- Dokumente ----------

    /** Lesen/Download: ADMIN, Eigentümer, Einzel-Datei-Freigabe oder Ordner-READ/WRITE. */
    @Transactional(readOnly = true)
    public boolean canReadDocument(User user, Document document) {
        if (isAdmin(user) || document.getUploadedBy().getId().equals(user.getId())) {
            return true;
        }
        if (documentShareRepository.existsByDocumentAndSharedWith(document, user)) {
            return true;
        }
        return document.getFolder() != null && canRead(user, document.getFolder());
    }

    /** Inhalt aktualisieren: ADMIN/Eigentümer oder WRITE auf dem Ordner (auch fremde Datei). */
    public boolean canUpdateDocumentContent(User user, Document document) {
        if (isAdmin(user) || document.getUploadedBy().getId().equals(user.getId())) {
            return true;
        }
        return document.getFolder() != null && canWrite(user, document.getFolder());
    }

    /**
     * Löschen/Umbenennen/Verschieben einer Datei: ADMIN/Eigentümer, ODER
     * WRITE-Empfänger **nur für selbst hochgeladene** Dateien (uploadedBy == user).
     */
    public boolean canModifyDocument(User user, Document document) {
        if (isAdmin(user) || document.getUploadedBy().getId().equals(user.getId())) {
            return true;
        }
        // Fremde Datei: FULL auf dem Ordner (Owner/ADMIN) — reines WRITE reicht NICHT.
        return document.getFolder() != null
                && effectivePermission(user, document.getFolder()) == AccessLevel.FULL;
    }

    // ---------- Helfer ----------

    private boolean shareApplies(FolderShare share, User user, List<UserGroup> groups) {
        if (share.getSharedWithUser() != null
                && share.getSharedWithUser().getId().equals(user.getId())) {
            return true;
        }
        return share.getSharedWithGroup() != null
                && groups.stream().anyMatch(g -> g.getId().equals(share.getSharedWithGroup().getId()));
    }

    private boolean ownsRootAncestor(User user, Folder folder) {
        Folder root = folder;
        while (root.getParentFolder() != null) {
            root = root.getParentFolder();
        }
        return root.getOwner().getId().equals(user.getId());
    }

    private boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    private AccessLevel max(AccessLevel a, AccessLevel b) {
        return a.ordinal() >= b.ordinal() ? a : b;
    }

    private boolean atLeast(AccessLevel level, AccessLevel min) {
        return level.ordinal() >= min.ordinal();
    }
}
