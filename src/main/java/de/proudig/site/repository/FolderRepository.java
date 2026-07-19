package de.proudig.site.repository;

import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, String> {
    List<Folder> findByOwnerAndParentFolderIsNull(User owner);
    List<Folder> findByOwnerAndParentFolder(User owner, Folder parentFolder);
    List<Folder> findByParentFolder(Folder parentFolder);
    Optional<Folder> findByIdAndOwner(String id, User owner);
    boolean existsByOwnerAndParentFolder(User owner, Folder parentFolder);
    long countByParentFolder(Folder parentFolder);
}
