package de.proudig.site.repository;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentShare;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentShareRepository extends JpaRepository<DocumentShare, String> {
    List<DocumentShare> findBySharedWith(User sharedWith);
    List<DocumentShare> findByDocument(Document document);
    Optional<DocumentShare> findByDocumentAndSharedWith(Document document, User sharedWith);
    void deleteByDocument(Document document);
    void deleteBySharedBy(User sharedBy);
    void deleteBySharedWith(User sharedWith);
}
