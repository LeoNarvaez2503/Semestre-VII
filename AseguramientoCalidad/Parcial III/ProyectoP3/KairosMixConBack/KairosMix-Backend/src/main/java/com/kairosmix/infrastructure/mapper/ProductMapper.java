package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.Product;
import com.kairosmix.infrastructure.rest.dto.ProductDTO;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public ProductDTO entityToDto(Product entity) {
        if (entity == null) {
            return null;
        }
        return ProductDTO.builder()
            .id(entity.getId())
            .code(entity.getCode())
            .name(entity.getName())
            .countryOfOrigin(entity.getCountryOfOrigin())
            .pricePerPound(entity.getPricePerPound())
            .wholesalePrice(entity.getWholesalePrice())
            .retailPrice(entity.getRetailPrice())
            .initialStock(entity.getInitialStock())
            .currentStock(entity.getCurrentStock())
            .build();
    }

    public Product dtoToEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }
        return Product.builder()
            .id(dto.getId())
            .code(dto.getCode())
            .name(dto.getName())
            .countryOfOrigin(dto.getCountryOfOrigin())
            .pricePerPound(dto.getPricePerPound())
            .wholesalePrice(dto.getWholesalePrice())
            .retailPrice(dto.getRetailPrice())
            .initialStock(dto.getInitialStock())
            .currentStock(dto.getCurrentStock())
            .build();
    }
}
