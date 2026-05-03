package ec.espe.chatsegurospring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RoomCreateRequestDTO {

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "El PIN debe tener 4 dígitos")
    private String pin;

    @NotBlank
    private String type;

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
