package ec.espe.chatsegurospring.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private String pinHash;

    private long createdAt;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("room")
    private List<SharedFile> files = new ArrayList<>();

    @Transient
    private Map<String, String> users = new LinkedHashMap<>();

    protected Room() {
    }

    public Room(String id, RoomType type, String pinHash, long createdAt) {
        this.id = id;
        this.type = type;
        this.pinHash = pinHash;
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

    public long getCreatedAt() {
        return createdAt;
    }

    public Map<String, String> getUsers() {
        if (users == null) {
            users = new LinkedHashMap<>();
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
