package de.proudig.site.service;

import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.UserUpdateRequest;
import de.proudig.site.repository.ActivityLogRepository;
import de.proudig.site.repository.ContentBlockRepository;
import de.proudig.site.repository.DocumentRepository;
import de.proudig.site.repository.DocumentShareRepository;
import de.proudig.site.repository.FolderRepository;
import de.proudig.site.repository.MediaRepository;
import de.proudig.site.repository.PageRepository;
import de.proudig.site.repository.RefreshTokenRepository;
import de.proudig.site.repository.RoleRepository;
import de.proudig.site.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit Tests für den Schutz der Administratorrolle in UserService.updateUser.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private ActivityLogRepository activityLogRepository;
    @Mock private DocumentShareRepository documentShareRepository;
    @Mock private ContentBlockRepository contentBlockRepository;
    @Mock private FolderRepository folderRepository;
    @Mock private DocumentRepository documentRepository;
    @Mock private MediaRepository mediaRepository;
    @Mock private PageRepository pageRepository;

    @InjectMocks
    private UserService userService;

    private User adminUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId("admin-1");
        adminUser.setEmail("admin@example.com");
        adminUser.setFirstName("Ada");
        adminUser.setLastName("Admin");
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(1L, "ADMIN"));
        adminUser.setRoles(roles);
    }

    private UserUpdateRequest removeAdminRequest() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setRoles(Set.of("USER")); // ADMIN wird entzogen
        return req;
    }

    @Test
    @DisplayName("Eigene Admin-Rolle kann nicht entzogen werden")
    void cannotRemoveOwnAdminRole() {
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));

        assertThatThrownBy(() -> userService.updateUser("admin-1", removeAdminRequest(), "admin@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("eigene");
    }

    @Test
    @DisplayName("Letzte Admin-Rolle kann nicht entzogen werden")
    void cannotRemoveLastAdminRole() {
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));
        when(userRepository.countByRoles_Name("ADMIN")).thenReturn(1L);

        assertThatThrownBy(() -> userService.updateUser("admin-1", removeAdminRequest(), "someone-else@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("letzte");
    }

    @Test
    @DisplayName("Admin-Rolle darf entzogen werden, wenn weitere Admins existieren")
    void canRemoveAdminWhenOtherAdminsExist() {
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));
        when(userRepository.countByRoles_Name("ADMIN")).thenReturn(2L);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(new Role(2L, "USER")));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        userService.updateUser("admin-1", removeAdminRequest(), "someone-else@example.com");

        assertThat(adminUser.getRoles()).extracting(Role::getName).containsExactly("USER");
    }

    @Test
    @DisplayName("Löschen wird abgelehnt, wenn der Benutzer eigene Inhalte besitzt")
    void deleteUserBlockedWhenOwnsContent() {
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));
        when(folderRepository.existsByOwner(adminUser)).thenReturn(true);

        assertThatThrownBy(() -> userService.deleteUser("admin-1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Inhalte");

        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    @DisplayName("Löschen räumt abhängige Daten auf und löscht den Benutzer ohne eigene Inhalte")
    void deleteUserCleansUpAndDeletes() {
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));
        // alle existsBy* liefern per Default false -> kein Eigentum

        userService.deleteUser("admin-1");

        verify(refreshTokenRepository).deleteByUser(adminUser);
        verify(activityLogRepository).deleteByUser(adminUser);
        verify(documentShareRepository).deleteBySharedBy(adminUser);
        verify(documentShareRepository).deleteBySharedWith(adminUser);
        verify(contentBlockRepository).clearUpdatedBy(adminUser);
        verify(userRepository).delete(adminUser);
    }
}
