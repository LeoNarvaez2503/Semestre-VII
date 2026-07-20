package com.kairosmix.infrastructure.mapper;

import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.domain.entities.MixComponent;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.infrastructure.rest.dto.CustomMixDTO;
import com.kairosmix.infrastructure.rest.dto.MixComponentDTO;
import com.kairosmix.infrastructure.rest.dto.MixNutritionalInfoDTO;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class CustomMixMapper {
    public CustomMixDTO entityToDto(CustomMix entity) {
        if (entity == null) {
            return null;
        }
        return CustomMixDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
            .description(entity.getDescription())
            .components(mapComponentsToDto(entity.getComponents()))
            .totalPrice(entity.getTotalPrice() != null ? entity.getTotalPrice().doubleValue() : null)
            .nutritionalInfo(mapNutritionalInfoToDto(entity.calculateNutritionalInfo()))
            .build();
    }

    public CustomMix dtoToEntity(CustomMixDTO dto) {
        if (dto == null) {
            return null;
        }
        CustomMix customMix = CustomMix.builder()
            .id(dto.getId())
            .name(dto.getName())
            .description(dto.getDescription())
            .totalPrice(dto.getTotalPrice() != null ? java.math.BigDecimal.valueOf(dto.getTotalPrice()) : null)
            .client(dto.getClientId() != null ? com.kairosmix.domain.entities.Client.builder().id(dto.getClientId()).build() : null)
            .build();

        if (dto.getComponents() != null) {
            dto.getComponents().stream()
                .map(this::dtoToComponent)
                .forEach(customMix::addComponent);
        }

        return customMix;
    }

    private List<MixComponentDTO> mapComponentsToDto(List<MixComponent> components) {
        if (components == null) {
            return Collections.emptyList();
        }
        return components.stream()
            .map(component -> MixComponentDTO.builder()
                .id(component.getId())
                .productId(component.getProduct() != null ? component.getProduct().getId() : null)
                .productCode(component.getProduct() != null ? component.getProduct().getCode() : null)
                .productName(component.getProduct() != null ? component.getProduct().getName() : null)
                .quantity(component.getQuantity())
                .unitPrice(component.getUnitPrice())
                .subtotal(component.getSubtotal())
                .nutritionalInfo(mapNutritionalInfoToDto(component.getNutritionalInfo()))
                .build())
            .toList();
    }

    private MixComponent dtoToComponent(MixComponentDTO dto) {
        if (dto == null) {
            return null;
        }

        Product product = null;
        if (dto.getProductId() != null) {
            product = Product.builder()
                .id(dto.getProductId())
                .code(dto.getProductCode())
                .name(dto.getProductName())
                .build();
        }

        return MixComponent.builder()
            .id(dto.getId())
            .product(product)
            .quantity(dto.getQuantity())
            .unitPrice(dto.getUnitPrice())
            .nutritionalInfo(dto.getNutritionalInfo() != null
                ? com.kairosmix.domain.entities.MixNutritionalInfo.builder()
                    .calories(dto.getNutritionalInfo().getCalories())
                    .protein(dto.getNutritionalInfo().getProtein())
                    .fat(dto.getNutritionalInfo().getFat())
                    .carbs(dto.getNutritionalInfo().getCarbs())
                    .fiber(dto.getNutritionalInfo().getFiber())
                    .build()
                : null)
            .build();
    }

    private MixNutritionalInfoDTO mapNutritionalInfoToDto(com.kairosmix.domain.entities.MixNutritionalInfo info) {
        if (info == null) {
            return null;
        }
        return MixNutritionalInfoDTO.builder()
            .calories(info.getCalories())
            .protein(info.getProtein())
            .fat(info.getFat())
            .carbs(info.getCarbs())
            .fiber(info.getFiber())
            .build();
    }
}
