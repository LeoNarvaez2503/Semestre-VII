package ec.espe.chatsegurospring.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@DisplayName("DTO Validation - Pruebas Unitarias")
class DTOValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: AdminLoginRequestDTO
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("AdminLoginRequestDTO: username y password válidos")
    void testAdminLoginRequestDTO_ValidCredentials() {
        AdminLoginRequestDTO dto = new AdminLoginRequestDTO();
        dto.setUsername("admin");
        dto.setPassword("admin123");

        Set<ConstraintViolation<AdminLoginRequestDTO>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("AdminLoginRequestDTO: username nulo viola @NotBlank")
    void testAdminLoginRequestDTO_UsernameNull() {
        AdminLoginRequestDTO dto = new AdminLoginRequestDTO();
        dto.setUsername(null);
        dto.setPassword("admin123");

        Set<ConstraintViolation<AdminLoginRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    @Test
    @DisplayName("AdminLoginRequestDTO: password vacío viola @NotBlank")
    void testAdminLoginRequestDTO_PasswordEmpty() {
        AdminLoginRequestDTO dto = new AdminLoginRequestDTO();
        dto.setUsername("admin");
        dto.setPassword("");

        Set<ConstraintViolation<AdminLoginRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    @Test
    @DisplayName("AdminLoginRequestDTO: username con espacios viola @NotBlank")
    void testAdminLoginRequestDTO_UsernameOnlySpaces() {
        AdminLoginRequestDTO dto = new AdminLoginRequestDTO();
        dto.setUsername("   ");
        dto.setPassword("admin123");

        Set<ConstraintViolation<AdminLoginRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: RoomCreateRequestDTO
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("RoomCreateRequestDTO: PIN válido (4 dígitos) y type válido")
    void testRoomCreateRequestDTO_ValidPINAndType() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin("1234");
        dto.setType("TEXTO");

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("RoomCreateRequestDTO: PIN inválido (3 dígitos) viola @Pattern")
    void testRoomCreateRequestDTO_PINTooShort() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin("123");
        dto.setType("TEXTO");

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .anyMatch(msg -> msg.contains("El PIN debe tener 4 dígitos"));
    }

    @Test
    @DisplayName("RoomCreateRequestDTO: PIN inválido (5 dígitos) viola @Pattern")
    void testRoomCreateRequestDTO_PINTooLong() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin("12345");
        dto.setType("TEXTO");

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .anyMatch(msg -> msg.contains("El PIN debe tener 4 dígitos"));
    }

    @Test
    @DisplayName("RoomCreateRequestDTO: PIN con letras viola @Pattern")
    void testRoomCreateRequestDTO_PINWithLetters() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin("12ab");
        dto.setType("TEXTO");

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .anyMatch(msg -> msg.contains("El PIN debe tener 4 dígitos"));
    }

    @Test
    @DisplayName("RoomCreateRequestDTO: PIN nulo viola @NotBlank")
    void testRoomCreateRequestDTO_PINNull() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin(null);
        dto.setType("TEXTO");

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    @Test
    @DisplayName("RoomCreateRequestDTO: type nulo viola @NotBlank")
    void testRoomCreateRequestDTO_TypeNull() {
        RoomCreateRequestDTO dto = new RoomCreateRequestDTO();
        dto.setPin("1234");
        dto.setType(null);

        Set<ConstraintViolation<RoomCreateRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    // ─────────────────────────────────────────────────────────────
    // TESTS: JoinRoomRequestDTO
    // ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("JoinRoomRequestDTO: PIN válido, nickname válido")
    void testJoinRoomRequestDTO_Valid() {
        JoinRoomRequestDTO dto = new JoinRoomRequestDTO();
        dto.setPin("1234");
        dto.setNickname("Juan");
        dto.setDeviceId("device-uuid");

        Set<ConstraintViolation<JoinRoomRequestDTO>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("JoinRoomRequestDTO: PIN inválido (3 dígitos) viola @Pattern")
    void testJoinRoomRequestDTO_InvalidPIN() {
        JoinRoomRequestDTO dto = new JoinRoomRequestDTO();
        dto.setPin("123");
        dto.setNickname("Juan");
        dto.setDeviceId("device-uuid");

        Set<ConstraintViolation<JoinRoomRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .anyMatch(msg -> msg.contains("El PIN debe tener 4 dígitos"));
    }

    @Test
    @DisplayName("JoinRoomRequestDTO: nickname nulo viola @NotBlank")
    void testJoinRoomRequestDTO_NicknameNull() {
        JoinRoomRequestDTO dto = new JoinRoomRequestDTO();
        dto.setPin("1234");
        dto.setNickname(null);
        dto.setDeviceId("device-uuid");

        Set<ConstraintViolation<JoinRoomRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    @Test
    @DisplayName("JoinRoomRequestDTO: nickname vacío viola @NotBlank")
    void testJoinRoomRequestDTO_NicknameEmpty() {
        JoinRoomRequestDTO dto = new JoinRoomRequestDTO();
        dto.setPin("1234");
        dto.setNickname("");
        dto.setDeviceId("device-uuid");

        Set<ConstraintViolation<JoinRoomRequestDTO>> violations = validator.validate(dto);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .contains("must not be blank");
    }

    @Test
    @DisplayName("JoinRoomRequestDTO: deviceId opcional (puede ser nulo)")
    void testJoinRoomRequestDTO_DeviceIdOptional() {
        JoinRoomRequestDTO dto = new JoinRoomRequestDTO();
        dto.setPin("1234");
        dto.setNickname("Juan");
        dto.setDeviceId(null);

        Set<ConstraintViolation<JoinRoomRequestDTO>> violations = validator.validate(dto);

        // deviceId NO tiene @NotBlank, así que puede ser nulo
        assertThat(violations).isEmpty();
    }
}
