package ec.espe.chatsegurospring.config;

import ec.espe.chatsegurospring.service.AdminTokenService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final AdminTokenService adminTokenService;

    public SecurityConfig(AdminTokenService adminTokenService) {
        this.adminTokenService = adminTokenService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/api/admin/login",
                            "/api/admin/status",
                            "/api/admin/logout",
                            "/ws/chat/**",
                            "/sockjs/**",
                            "/",
                            "/**/*.html",
                            "/**/*.js",
                            "/**/*.css",
                            "/**/*.png",
                            "/**/*.jpg",
                            "/**/*.jpeg",
                            "/**/*.gif",
                            "/api/rooms/join",
                            "/api/rooms/**/info",
                            "/api/rooms/**/upload",
                            "/uploads/**",
                            "/api/rooms/create"
                    ).permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(new AdminTokenFilter(adminTokenService), BasicAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
