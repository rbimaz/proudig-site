package de.proudig.site.repository;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByUploadedBy(User uploadedBy);
    List<Document> findByFolder(Folder folder);
    List<Document> findByUploadedByAndFolderIsNull(User uploadedBy);
    Optional<Document> findByIdAndUploadedBy(String id, User uploadedBy);
    long countByFolder(Folder folder);
}
