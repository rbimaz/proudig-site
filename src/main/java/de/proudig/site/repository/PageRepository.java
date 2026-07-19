package de.proudig.site.repository;


import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<de.proudig.site.domain.Page, String> {
    Optional<de.proudig.site.domain.Page> findBySlug(String slug);
    Page findByCategoryAndStatus(PageCategory category, PageStatus status, Pageable pageable);
    Page findByCategoryAndStatusAndTagsContaining(PageCategory category, PageStatus status, String tag, Pageable pageable);
    Page findByCategoryAndStatusNot(PageCategory category, PageStatus status, Pageable pageable);
    List<String> findDistinctTagsByCategoryAndStatus(PageCategory category, PageStatus status);
    Page findByCategory(PageCategory category, Pageable pageable);
    boolean existsByAuthor(User author);
}
