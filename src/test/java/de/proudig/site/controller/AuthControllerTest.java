package de.proudig.site.controller;

import de.proudig.site.domain.RefreshToken;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.AuthRequest;
import de.proudig.site.repository.UserRepository;
import de.proudig.site.security.JwtTokenProvider;
import de.proudig.site.service.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit Tests für AuthController
 *
 * Diese Tests stellen sicher, dass die Authentifizierung korrekt funktioniert
 * und insbesondere die Rollen OHNE "ROLE_"-Prefix an das Frontend gesendet werden.
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private Role adminRole;
    private Role consultantRole;

    @BeforeEach
    void setUp() {
        adminRole = new Role();
        adminRole.setId(1L);
        adminRole.setName("ADMIN");

        consultantRole = new Role();
        consultantRole.setId(2L);
        consultantRole.setName("CONSULTANT");

        testUser = new User();
        testUser.setId("test-user-id");
        testUser.setEmail("admin@proudig.de");
        testUser.setPassword("encoded-password");
        testUser.setFirstName("Admin");
        testUser.setLastName("ProuDig");
        testUser.setRoles(new HashSet<>(Set.of(adminRole)));
    }

    @Nested
    @DisplayName("Login Endpoint")
    class LoginTests {

        @Test
        @DisplayName("Given ein Benutzer mit ADMIN-Rolle existiert, " +
                     "When Login erfolgreich ist, " +
                     "Then enthält die Antwort die Rolle 'ADMIN' ohne ROLE_-Prefix")
        void loginReturnsRolesWithoutRolePrefix() {
            // Given
            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail("admin@proudig.de");
            authRequest.setPassword("password");

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(testUser);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(jwtTokenProvider.generateToken(any())).thenReturn("jwt-token");
            when(userRepository.findByEmail("admin@proudig.de")).thenReturn(Optional.of(testUser));

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken("refresh-token");
            when(refreshTokenService.createRefreshToken(any())).thenReturn(refreshToken);

            // When
            ResponseEntity<?> response = authController.login(authRequest);

            // Then
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isInstanceOf(de.proudig.site.dto.AuthResponse.class);

            var authResponse = (de.proudig.site.dto.AuthResponse) response.getBody();
            assertThat(authResponse.getRoles())
                    .contains("ADMIN")
                    .doesNotContain("ROLE_ADMIN");
        }

        @Test
        @DisplayName("Given ein Benutzer mit CONSULTANT-Rolle existiert, " +
                     "When Login erfolgreich ist, " +
                     "Then enthält die Antwort die Rolle 'CONSULTANT' ohne ROLE_-Prefix")
        void loginReturnsConsultantRoleWithoutPrefix() {
            // Given
            testUser.setRoles(new HashSet<>(Set.of(consultantRole)));

            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail("admin@proudig.de");
            authRequest.setPassword("password");

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(testUser);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(jwtTokenProvider.generateToken(any())).thenReturn("jwt-token");
            when(userRepository.findByEmail("admin@proudig.de")).thenReturn(Optional.of(testUser));

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken("refresh-token");
            when(refreshTokenService.createRefreshToken(any())).thenReturn(refreshToken);

            // When
            ResponseEntity<?> response = authController.login(authRequest);

            // Then
            var authResponse = (de.proudig.site.dto.AuthResponse) response.getBody();
            assertThat(authResponse.getRoles())
                    .contains("CONSULTANT")
                    .doesNotContain("ROLE_CONSULTANT");
        }

        @Test
        @DisplayName("Given ein Benutzer mit mehreren Rollen existiert, " +
                     "When Login erfolgreich ist, " +
                     "Then enthält die Antwort alle Rollen ohne ROLE_-Prefix")
        void loginReturnsMultipleRolesWithoutPrefix() {
            // Given
            testUser.setRoles(new HashSet<>(Set.of(adminRole, consultantRole)));

            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail("admin@proudig.de");
            authRequest.setPassword("password");

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(testUser);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(jwtTokenProvider.generateToken(any())).thenReturn("jwt-token");
            when(userRepository.findByEmail("admin@proudig.de")).thenReturn(Optional.of(testUser));

            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken("refresh-token");
            when(refreshTokenService.createRefreshToken(any())).thenReturn(refreshToken);

            // When
            ResponseEntity<?> response = authController.login(authRequest);

            // Then
            var authResponse = (de.proudig.site.dto.AuthResponse) response.getBody();
            assertThat(authResponse.getRoles())
                    .containsExactlyInAnyOrder("ADMIN", "CONSULTANT")
                    .noneMatch(role -> role.startsWith("ROLE_"));
        }

        @Test
        @DisplayName("Given ungültige Anmeldedaten, " +
                     "When Login fehlschlägt, " +
                     "Then wird HTTP 401 zurückgegeben")
        void loginWithInvalidCredentialsReturns401() {
            // Given
            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail("wrong@email.de");
            authRequest.setPassword("wrong-password");

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

            // When
            ResponseEntity<?> response = authController.login(authRequest);

            // Then
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        }
    }

    @Nested
    @DisplayName("Refresh Token Endpoint")
    class RefreshTests {

        @Test
        @DisplayName("Given ein gültiger Refresh-Token existiert, " +
                     "When Token erneuert wird, " +
                     "Then enthält die Antwort die Rollen ohne ROLE_-Prefix")
        void refreshReturnsRolesWithoutPrefix() {
            // Given
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken("valid-refresh-token");
            refreshToken.setUser(testUser);

            when(refreshTokenService.findByToken("valid-refresh-token")).thenReturn(Optional.of(refreshToken));
            when(jwtTokenProvider.generateToken(any())).thenReturn("new-jwt-token");

            AuthController.RefreshTokenRequest request = new AuthController.RefreshTokenRequest("valid-refresh-token");

            // When
            ResponseEntity<?> response = authController.refresh(request);

            // Then
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            var authResponse = (de.proudig.site.dto.AuthResponse) response.getBody();
            assertThat(authResponse.getRoles())
                    .contains("ADMIN")
                    .doesNotContain("ROLE_ADMIN");
        }
    }
}
