package ec.espe.chatsegurospring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class JoinRoomRequestDTO {

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "El PIN debe tener 4 dígitos")
    private String pin;

    @NotBlank
    private String nickname;

    private String deviceId;

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
