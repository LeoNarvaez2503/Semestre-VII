package ec.espe.chatsegurospring.config;

import ec.espe.chatsegurospring.service.AdminTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class AdminTokenFilter extends OncePerRequestFilter {

    private final AdminTokenService tokenService;

    public AdminTokenFilter(AdminTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/admin/login") || path.startsWith("/api/rooms/join") || path.startsWith("/api/rooms/") && path.endsWith("/info") || path.startsWith("/ws/chat") || path.startsWith("/sockjs");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromCookie(request);
        if (token != null && tokenService.validToken(token)) {
            Authentication authentication = new UsernamePasswordAuthenticationToken("admin", null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if ("admin-token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
