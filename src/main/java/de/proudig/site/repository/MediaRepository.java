package de.proudig.site.repository;

import de.proudig.site.domain.Media;
import de.proudig.site.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, String> {
    List<Media> findAllByOrderByCreatedAtDesc();
    boolean existsByUploadedBy(User uploadedBy);
}
