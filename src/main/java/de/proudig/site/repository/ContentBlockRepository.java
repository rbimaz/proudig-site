package de.proudig.site.repository;

import de.proudig.site.domain.ContentBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentBlockRepository extends JpaRepository<ContentBlock, String> {
    Optional<ContentBlock> findBySectionKey(String sectionKey);
    List<ContentBlock> findAllByPublishedAtIsNotNull();
}
