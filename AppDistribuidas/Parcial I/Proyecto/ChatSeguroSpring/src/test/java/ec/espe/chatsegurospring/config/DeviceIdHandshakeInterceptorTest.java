package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("DeviceIdHandshakeInterceptor - Pruebas de Interceptor de Handshake WebSocket")
class DeviceIdHandshakeInterceptorTest {

    @Test
    @DisplayName("BeforeHandshake: extrae deviceId del cookie correctamente")
    void beforeHandshake_setsDeviceIdFromCookie() {
        MockHttpServletRequest servletReq = new MockHttpServletRequest();
        servletReq.setCookies(new jakarta.servlet.http.Cookie("deviceId", "my-device"));

        ServletServerHttpRequest request = new ServletServerHttpRequest(servletReq);
        Map<String, Object> attrs = new HashMap<>();

        DeviceIdHandshakeInterceptor interceptor = new DeviceIdHandshakeInterceptor();
        boolean res = interceptor.beforeHandshake(request, null, null, attrs);

        assertThat(res).isTrue();
        assertThat(attrs).containsEntry("deviceId", "my-device");
    }

    @Test
    @DisplayName("BeforeHandshake: sin cookies, no agrega deviceId")
    void beforeHandshake_noCookies_returnsTrue() {
        MockHttpServletRequest servletReq = new MockHttpServletRequest();
        ServletServerHttpRequest request = new ServletServerHttpRequest(servletReq);
        Map<String, Object> attrs = new HashMap<>();

        DeviceIdHandshakeInterceptor interceptor = new DeviceIdHandshakeInterceptor();
        boolean res = interceptor.beforeHandshake(request, null, null, attrs);

        assertThat(res).isTrue();
        assertThat(attrs).doesNotContainKey("deviceId");
    }

    @Test
    @DisplayName("BeforeHandshake: hay cookies pero ninguno es deviceId, no agrega nada")
    void beforeHandshake_cookiesWithoutDeviceId_doesNothing() {
        MockHttpServletRequest servletReq = new MockHttpServletRequest();
        servletReq.setCookies(
                new jakarta.servlet.http.Cookie("sessionId", "abc123"),
                new jakarta.servlet.http.Cookie("theme", "dark")
        );

        ServletServerHttpRequest request = new ServletServerHttpRequest(servletReq);
        Map<String, Object> attrs = new HashMap<>();

        DeviceIdHandshakeInterceptor interceptor = new DeviceIdHandshakeInterceptor();
        boolean res = interceptor.beforeHandshake(request, null, null, attrs);

        assertThat(res).isTrue();
        assertThat(attrs).doesNotContainKey("deviceId");
    }
}
