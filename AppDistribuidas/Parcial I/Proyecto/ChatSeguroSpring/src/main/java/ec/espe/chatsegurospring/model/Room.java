package ec.espe.chatsegurospring.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private String pinHash;

    /**
     * SHA-256 hex digest of the raw PIN, used for fast O(1) lookups
     * instead of iterating all rooms with BCrypt.checkpw().
     */
    @Column(name = "pin_digest", length = 64)
    private String pinDigest;

    private long createdAt;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("room")
    private List<SharedFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("room")
    private List<RoomUser> users = new ArrayList<>();

    protected Room() {
    }

    public Room(String id, RoomType type, String pinHash, String pinDigest, long createdAt) {
        this.id = id;
        this.type = type;
        this.pinHash = pinHash;
        this.pinDigest = pinDigest;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public RoomType getType() {
        return type;
    }

    public String getPinHash() {
        return pinHash;
    }

    public String getPinDigest() {
        return pinDigest;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public List<RoomUser> getUsers() {
        if (users == null) {
            users = new ArrayList<>();
        }
        return users;
    }

    public List<SharedFile> getFiles() {
        if (files == null) {
            files = new ArrayList<>();
        }
        return files;
    }
}
