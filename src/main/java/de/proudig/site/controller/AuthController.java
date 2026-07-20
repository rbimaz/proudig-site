package de.proudig.site.controller;

import de.proudig.site.domain.RefreshToken;
import de.proudig.site.domain.Role;
import de.proudig.site.domain.User;
import de.proudig.site.dto.AuthRequest;
import de.proudig.site.dto.AuthResponse;
import de.proudig.site.repository.UserRepository;
import de.proudig.site.security.JwtTokenProvider;
import de.proudig.site.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userRepository.findByEmail(userDetails.getUsername()).orElseThrow());
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            user.setLastLoginAt(java.time.LocalDateTime.now());
            userRepository.save(user);
            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setRefreshToken(refreshToken.getToken());
            authResponse.setEmail(user.getEmail());
            authResponse.setFirstName(user.getFirstName());
            authResponse.setLastName(user.getLastName());
            authResponse.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
            authResponse.setForcePasswordChange(user.isForcePasswordChange());
            return ResponseEntity.ok(authResponse);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid email or password"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken()).orElseThrow(() -> new RuntimeException("Refresh token not found"));
            refreshTokenService.verifyExpiration(refreshToken);
            User user = refreshToken.getUser();
            String newToken = jwtTokenProvider.generateToken(user);
            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(newToken);
            authResponse.setRefreshToken(refreshToken.getToken());
            authResponse.setEmail(user.getEmail());
            authResponse.setFirstName(user.getFirstName());
            authResponse.setLastName(user.getLastName());
            authResponse.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
            authResponse.setForcePasswordChange(user.isForcePasswordChange());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid refresh token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken()).orElseThrow(() -> new RuntimeException("Refresh token not found"));
            refreshTokenService.deleteByUser(refreshToken.getUser());
            return ResponseEntity.ok(new SuccessResponse("Logout successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Logout failed"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Not authenticated"));
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("User not found"));
        }
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Current password is incorrect"));
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("Passwort muss mindestens 3 Zeichen lang sein"));
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setForcePasswordChange(false);
        userRepository.save(user);
        return ResponseEntity.ok(new SuccessResponse("Password changed successfully"));
    }


    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public ChangePasswordRequest() {
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }


    public static class RefreshTokenRequest {
        public String refreshToken;

        public RefreshTokenRequest() {
        }

        public RefreshTokenRequest(String refreshToken) {
            this.refreshToken = refreshToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }


    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }


    public static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public AuthController(final AuthenticationManager authenticationManager, final JwtTokenProvider jwtTokenProvider, final RefreshTokenService refreshTokenService, final UserRepository userRepository, final PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
}
