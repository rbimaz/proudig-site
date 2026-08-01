package de.proudig.site.repository;


import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<de.proudig.site.domain.Page, String> {
    Optional<de.proudig.site.domain.Page> findBySlug(String slug);
    Page findByCategoryAndStatus(PageCategory category, PageStatus status, Pageable pageable);
    Page findByCategoryAndStatusAndTagsContaining(PageCategory category, PageStatus status, String tag, Pageable pageable);
    Page findByCategoryAndStatusNot(PageCategory category, PageStatus status, Pageable pageable);
    Page findByCategoryAndStatusAndShowInHero(PageCategory category, PageStatus status, boolean showInHero, Pageable pageable);
    // Liefert die (komma-getrennten) tags-Strings der passenden Seiten. Explizite
    // Query nötig: die Derived-Query-Namensableitung liefert sonst Page-Entitäten
    // statt der tags-Spalte -> Konvertierungsfehler.
    @Query("SELECT DISTINCT p.tags FROM Page p WHERE p.category = ?1 AND p.status = ?2 AND p.tags IS NOT NULL AND p.tags <> ''")
    List<String> findDistinctTagsByCategoryAndStatus(PageCategory category, PageStatus status);
    Page findByCategory(PageCategory category, Pageable pageable);
    boolean existsByAuthor(User author);
}
