package ec.espe.chatsegurospring.config;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    @SuppressWarnings("deprecation")
    @Test
    void handleMaxSizeException_returnsBadRequest() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        ResponseEntity<?> resp = handler.handleMaxSizeException(new MaxUploadSizeExceededException(1));

        assertThat(resp.getStatusCodeValue()).isEqualTo(400);
        assertThat(resp.getBody()).isInstanceOf(Map.class);
    }
}
