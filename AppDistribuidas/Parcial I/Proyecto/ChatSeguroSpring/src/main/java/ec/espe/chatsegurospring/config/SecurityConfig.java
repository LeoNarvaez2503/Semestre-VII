package ec.espe.chatsegurospring.config;

import ec.espe.chatsegurospring.service.AdminTokenService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final AdminTokenService adminTokenService;

    public SecurityConfig(AdminTokenService adminTokenService) {
        this.adminTokenService = adminTokenService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/admin/login", "/api/admin/status", "/ws/chat/**", "/sockjs/**", "/", "/**/*.html", "/**/*.js", "/**/*.css", "/**/*.png", "/**/*.jpg", "/**/*.jpeg", "/**/*.gif", "/api/rooms/join", "/api/rooms/**/info").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/rooms/create").authenticated()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(new AdminTokenFilter(adminTokenService), BasicAuthenticationFilter.class);

        return http.build();
    }
}
