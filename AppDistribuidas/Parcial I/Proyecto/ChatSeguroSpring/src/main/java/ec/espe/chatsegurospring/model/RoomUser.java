package ec.espe.chatsegurospring.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "room_users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"room_id", "nickname"}),
        @UniqueConstraint(columnNames = {"device_id"})
})
public class RoomUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "device_id", nullable = false)
    private String deviceId;

    private long joinedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private Room room;

    protected RoomUser() {
    }

    public RoomUser(String nickname, String deviceId, long joinedAt, Room room) {
        this.nickname = nickname;
        this.deviceId = deviceId;
        this.joinedAt = joinedAt;
        this.room = room;
    }

    public Long getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public long getJoinedAt() {
        return joinedAt;
    }

    public Room getRoom() {
        return room;
    }
}
