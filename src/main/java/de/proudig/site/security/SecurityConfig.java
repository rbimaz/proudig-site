package de.proudig.site.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        // Public endpoints
        // Protected endpoints
        // Any other requests
        http.csrf(csrf -> csrf.disable()).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(authz -> authz.requestMatchers("/api/auth/change-password").authenticated().requestMatchers("/api/auth/**").permitAll().requestMatchers("/api/preview-auth").permitAll().requestMatchers("/api/content/**").permitAll().requestMatchers("/api/blog/**").permitAll().requestMatchers("/api/seminare/**").permitAll().requestMatchers("/api/media/**").permitAll().requestMatchers("/api/rss/**").permitAll().requestMatchers("/api/pages/**").permitAll().requestMatchers("/api/seo/**").permitAll().requestMatchers("/api/contact").permitAll().requestMatchers("/", "/index.html", "/static/**", "/assets/**").permitAll().requestMatchers("/api/admin/**").authenticated().requestMatchers("/api/portal/**").authenticated().requestMatchers("/api/users/**").authenticated().requestMatchers("/api/documents/**").authenticated().requestMatchers("/api/folders/**").authenticated().requestMatchers("/api/shares/**").authenticated().anyRequest().permitAll()).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    public SecurityConfig(final JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
}
