package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Client;
import com.kairosmix.domain.entities.Order;
import com.kairosmix.domain.entities.OrderItem;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.infrastructure.rest.dto.OrderDTO;
import com.kairosmix.infrastructure.rest.dto.OrderItemDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Component
public class OrderMapper {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public OrderDTO entityToDto(Order entity) {
        if (entity == null) {
            return null;
        }
        return OrderDTO.builder()
            .id(entity.getId())
            .clientId(entity.getClient().getId())
            .clientName(entity.getClient().getName())
            .status(entity.getStatus().name())
            .items(mapItemsToDto(entity.getItems()))
            .totalPrice(entity.getTotalPrice())
            .notes(entity.getNotes())
            .createdAt(formatDateTime(entity.getCreatedAt()))
            .completedAt(formatDateTime(entity.getCompletedAt()))
            .version(entity.getVersion())
            .build();
    }

    public Order dtoToEntity(OrderDTO dto) {
        if (dto == null) {
            return null;
        }
        return Order.builder()
            .id(dto.getId())
            .client(Client.builder().id(dto.getClientId()).build())
            .status(Order.OrderStatus.valueOf(dto.getStatus()))
            .items(mapItemsFromDto(dto.getItems()))
            .totalPrice(dto.getTotalPrice())
            .notes(dto.getNotes())
            .version(dto.getVersion())
            .build();
    }

    private List<OrderItemDTO> mapItemsToDto(List<OrderItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }
        return items.stream()
            .map(item -> OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productCode(item.getProduct().getCode())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .priceType(item.getPriceType())
                .subtotal(item.getSubtotal())
                .build())
            .toList();
    }

    private List<OrderItem> mapItemsFromDto(List<OrderItemDTO> dtoItems) {
        if (dtoItems == null) {
            return Collections.emptyList();
        }
        return dtoItems.stream()
            .map(dto -> OrderItem.builder()
                .id(dto.getId())
                .product(Product.builder().id(dto.getProductId()).build())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .priceType(dto.getPriceType())
                .build())
            .toList();
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(formatter) : null;
    }
}
