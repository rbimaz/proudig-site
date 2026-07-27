package de.proudig.site.repository;

import de.proudig.site.domain.Document;
import de.proudig.site.domain.ExternalShareLink;
import de.proudig.site.domain.Folder;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExternalShareLinkRepository extends JpaRepository<ExternalShareLink, String> {
    Optional<ExternalShareLink> findByToken(String token);
    List<ExternalShareLink> findByDocument(Document document);
    List<ExternalShareLink> findByFolder(Folder folder);
    List<ExternalShareLink> findByRevokedFalseOrderByCreatedAtDesc();
    void deleteByCreatedBy(User createdBy);
}
