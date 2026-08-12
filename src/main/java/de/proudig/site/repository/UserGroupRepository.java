package de.proudig.site.repository;

import de.proudig.site.domain.User;
import de.proudig.site.domain.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserGroupRepository extends JpaRepository<UserGroup, String> {
    boolean existsByName(String name);

    Optional<UserGroup> findByName(String name);

    /** Alle Gruppen, in denen der Nutzer Mitglied ist. */
    List<UserGroup> findByMembersContains(User user);
}
