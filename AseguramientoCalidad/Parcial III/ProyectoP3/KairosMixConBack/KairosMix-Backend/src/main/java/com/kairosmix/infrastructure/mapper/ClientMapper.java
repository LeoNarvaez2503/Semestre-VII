package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Client.DocumentType;
import com.kairosmix.infrastructure.rest.dto.ClientDTO;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {
    public ClientDTO entityToDto(Client entity) {
        if (entity == null) {
            return null;
        }
        return ClientDTO.builder()
            .id(entity.getId())
            .documentId(entity.getDocumentId())
            .documentType(entity.getDocumentType().name())
            .name(entity.getName())
            .email(entity.getEmail())
            .phone(entity.getPhone())
            .address(entity.getAddress())
            .city(entity.getCity())
            .build();
    }

    public Client dtoToEntity(ClientDTO dto) {
        if (dto == null) {
            return null;
        }
        return Client.builder()
            .id(dto.getId())
            .documentId(dto.getDocumentId())
            .documentType(DocumentType.valueOf(dto.getDocumentType().toUpperCase()))
            .name(dto.getName())
            .email(dto.getEmail())
            .phone(dto.getPhone())
            .address(dto.getAddress())
            .city(dto.getCity())
            .build();
    }
}
