package de.proudig.site.repository;

import de.proudig.site.domain.Folder;
import de.proudig.site.domain.FolderShare;
import de.proudig.site.domain.User;
import de.proudig.site.domain.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FolderShareRepository extends JpaRepository<FolderShare, String> {
    List<FolderShare> findByFolder(Folder folder);

    Optional<FolderShare> findByFolderAndSharedWithUser(Folder folder, User user);

    Optional<FolderShare> findByFolderAndSharedWithGroup(Folder folder, UserGroup group);

    /** Freigaben, die direkt an den Nutzer oder an eine seiner Gruppen gehen. */
    List<FolderShare> findBySharedWithUserOrSharedWithGroupIn(User user, Collection<UserGroup> groups);

    void deleteByFolder(Folder folder);

    void deleteBySharedWithGroup(UserGroup group);
}
