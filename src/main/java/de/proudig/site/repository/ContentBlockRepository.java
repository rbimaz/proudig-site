package de.proudig.site.repository;

import de.proudig.site.domain.ContentBlock;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentBlockRepository extends JpaRepository<ContentBlock, String> {
    Optional<ContentBlock> findBySectionKey(String sectionKey);
    List<ContentBlock> findAllByPublishedAtIsNotNull();

    @Modifying
    @Query("update ContentBlock c set c.updatedBy = null where c.updatedBy = :user")
    void clearUpdatedBy(@Param("user") User user);
}
