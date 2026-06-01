package ec.espe.chatsegurospring.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("RoomType - Enum de tipos de sala")
class RoomTypeTest {

    @Test
    @DisplayName("RoomType debe tener dos valores: TEXTO y MULTIMEDIA")
    void testRoomTypeValues() {
        assertThat(RoomType.values())
                .hasSize(2)
                .contains(RoomType.TEXTO, RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("RoomType.TEXTO debe existir")
    void testTextoRoomTypeExists() {
        assertThat(RoomType.TEXTO).isNotNull();
    }

    @Test
    @DisplayName("RoomType.MULTIMEDIA debe existir")
    void testMultimediaRoomTypeExists() {
        assertThat(RoomType.MULTIMEDIA).isNotNull();
    }

    @Test
    @DisplayName("RoomType valores deben ser distintos")
    void testRoomTypeValuesAreDistinct() {
        assertThat(RoomType.TEXTO).isNotEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("RoomType.valueOf funciona correctamente")
    void testRoomTypeValueOf() {
        assertThat(RoomType.valueOf("TEXTO")).isEqualTo(RoomType.TEXTO);
        assertThat(RoomType.valueOf("MULTIMEDIA")).isEqualTo(RoomType.MULTIMEDIA);
    }

    @Test
    @DisplayName("RoomType.name retorna nombre correcto")
    void testRoomTypeName() {
        assertThat(RoomType.TEXTO.name()).isEqualTo("TEXTO");
        assertThat(RoomType.MULTIMEDIA.name()).isEqualTo("MULTIMEDIA");
    }

    @Test
    @DisplayName("RoomType es enum")
    void testRoomTypeIsEnum() {
        assertThat(RoomType.class.isEnum()).isTrue();
    }
}
