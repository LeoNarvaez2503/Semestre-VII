package ec.espe.chatsegurospring.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "shared_files")
public class SharedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalName;

    private String url;

    private String contentType;

    private long size;

    private String sender;

    private long uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private Room room;

    protected SharedFile() {
    }

    public SharedFile(String originalName, String url, String contentType, long size, String sender, long uploadedAt, Room room) {
        this.originalName = originalName;
        this.url = url;
        this.contentType = contentType;
        this.size = size;
        this.sender = sender;
        this.uploadedAt = uploadedAt;
        this.room = room;
    }

    public Long getId() {
        return id;
    }

    public String getOriginalName() {
        return originalName;
    }

    public String getUrl() {
        return url;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSize() {
        return size;
    }

    public String getSender() {
        return sender;
    }

    public long getUploadedAt() {
        return uploadedAt;
    }

    public Room getRoom() {
        return room;
    }
}
