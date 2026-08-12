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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Zentrale, autoritative Zugriffsprüfung für Ordner und Dokumente.
 *
 * <p>Die effektive Berechtigung auf einen Ordner ergibt sich als Union
 * („großzügigste gewinnt") aus: ADMIN (voll), Eigentum an dem Ordner oder einem
 * Vorfahren (voll), sowie READ/WRITE-Freigaben an den Nutzer oder eine seiner
 * Gruppen auf dem Ordner oder einem Vorfahren. Sicherheitskritisch — einzige
 * Quelle der Wahrheit; kein Enforcement in Controllern duplizieren.
 *
 * <p>Für Listen wird ein {@link AccessContext} je Anfrage einmal aufgebaut
 * (Gruppen + Freigaben des Nutzers einmal geladen); die Bewertung einzelner
 * Ordner löst dann keine weiteren Freigabe-/Gruppen-Queries aus.
 */
@Service
public class PortalAccessService {

    /** Stufen aufsteigend nach Mächtigkeit (ordinal für max()). */
    public enum AccessLevel {
        NONE, READ, WRITE, FULL
    }

    /**
     * Vorab geladener Bewertungskontext eines Nutzers: ADMIN-Flag, Nutzer-ID und
     * eine Map „Freigabe-Ordner-ID → Berechtigung" (aus Nutzer- und Gruppen-Shares).
     */
    public static class AccessContext {
        private final boolean admin;
        private final String userId;
        private final Map<String, AccessLevel> shareByFolderId;

        public AccessContext(boolean admin, String userId, Map<String, AccessLevel> shareByFolderId) {
            this.admin = admin;
            this.userId = userId;
            this.shareByFolderId = shareByFolderId;
        }

        public boolean isAdmin() {
            return admin;
        }
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

    // ---------- Kontext (je Anfrage einmal) ----------

    /**
     * Baut den Bewertungskontext für den Nutzer: Gruppen einmal, Freigaben (direkt
     * + über Gruppen) einmal in eine Ordner-ID → Berechtigung-Map.
     */
    @Transactional(readOnly = true)
    public AccessContext contextFor(User user) {
        boolean admin = isAdmin(user);
        Map<String, AccessLevel> shareByFolderId = new HashMap<>();
        if (!admin) {
            List<UserGroup> groups = userGroupRepository.findByMembersContains(user);
            for (FolderShare share : folderShareRepository.findBySharedWithUserOrSharedWithGroupIn(user, groups)) {
                AccessLevel lvl = share.getPermission() == SharePermission.WRITE
                        ? AccessLevel.WRITE : AccessLevel.READ;
                shareByFolderId.merge(share.getFolder().getId(), lvl, this::max);
            }
        }
        return new AccessContext(admin, user.getId(), shareByFolderId);
    }

    // ---------- Ordner (kontextbasiert) ----------

    /** Effektive Berechtigung gegen den vorab geladenen Kontext (keine DB-Queries). */
    public AccessLevel effectivePermission(AccessContext ctx, Folder folder) {
        if (ctx.admin) {
            return AccessLevel.FULL;
        }
        AccessLevel best = AccessLevel.NONE;
        for (Folder cursor = folder; cursor != null; cursor = cursor.getParentFolder()) {
            if (cursor.getOwner().getId().equals(ctx.userId)) {
                return AccessLevel.FULL;
            }
            AccessLevel lvl = ctx.shareByFolderId.get(cursor.getId());
            if (lvl != null) {
                best = max(best, lvl);
            }
        }
        return best;
    }

    public boolean canRead(AccessContext ctx, Folder folder) {
        return atLeast(effectivePermission(ctx, folder), AccessLevel.READ);
    }

    public boolean canWrite(AccessContext ctx, Folder folder) {
        return atLeast(effectivePermission(ctx, folder), AccessLevel.WRITE);
    }

    public boolean canDeleteFolder(AccessContext ctx, Folder folder) {
        return effectivePermission(ctx, folder) == AccessLevel.FULL;
    }

    public boolean canMoveFolder(AccessContext ctx, Folder folder, Folder target) {
        if (effectivePermission(ctx, folder) != AccessLevel.FULL) {
            return false;
        }
        if (target == null) {
            return ctx.admin || ownsRootAncestor(ctx.userId, folder);
        }
        return canWrite(ctx, target);
    }

    // ---------- Ordner (Einzelprüfung; baut intern einen Kontext) ----------

    /** Effektive Berechtigung des Nutzers auf den Ordner (Vorfahren-Walk, Union). */
    @Transactional(readOnly = true)
    public AccessLevel effectivePermission(User user, Folder folder) {
        return effectivePermission(contextFor(user), folder);
    }

    public boolean canRead(User user, Folder folder) {
        return canRead(contextFor(user), folder);
    }

    public boolean canWrite(User user, Folder folder) {
        return canWrite(contextFor(user), folder);
    }

    public boolean canDeleteFolder(User user, Folder folder) {
        return canDeleteFolder(contextFor(user), folder);
    }

    public boolean canMoveFolder(User user, Folder folder, Folder target) {
        return canMoveFolder(contextFor(user), folder, target);
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

    private boolean ownsRootAncestor(String userId, Folder folder) {
        Folder root = folder;
        while (root.getParentFolder() != null) {
            root = root.getParentFolder();
        }
        return root.getOwner().getId().equals(userId);
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
