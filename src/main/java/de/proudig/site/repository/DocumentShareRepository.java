package de.proudig.site.repository;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.DocumentShare;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentShareRepository extends JpaRepository<DocumentShare, String> {
    List<DocumentShare> findBySharedWith(User sharedWith);
    List<DocumentShare> findByDocument(Document document);
    boolean existsByDocumentAndSharedWith(Document document, User sharedWith);
    void deleteByDocumentAndSharedWith(Document document, User sharedWith);
    void deleteByDocument(Document document);
    void deleteBySharedWith(User sharedWith);
    void deleteBySharedBy(User sharedBy);
}
