package com.kairosmix.application.usecases;

import com.kairosmix.domain.entities.CustomMix;
import com.kairosmix.domain.entities.MixComponent;
import com.kairosmix.domain.entities.Product;
import com.kairosmix.domain.ports.output.CustomMixRepositoryPort;
import com.kairosmix.domain.ports.output.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateCustomMixUseCase {
    private final CustomMixRepositoryPort customMixRepository;
    private final ProductRepositoryPort productRepository;

    public CustomMix execute(CustomMix customMix) {
        if (customMix == null) {
            throw new IllegalArgumentException("La mezcla no puede ser nula");
        }

        // Validar que el nombre sea único
        customMixRepository.findByName(customMix.getName()).ifPresent(m -> {
            throw new IllegalArgumentException("Ya existe una mezcla con el nombre: " + customMix.getName());
        });

        // Validar mezcla
        customMix.validateMix();

        // Cargar productos gestionados antes de persistir la mezcla
        resolveProducts(customMix);

        // Calcular información nutricional
        customMix.calculateTotal();

        return customMixRepository.save(customMix);
    }

    private void resolveProducts(CustomMix customMix) {
        List<MixComponent> components = customMix.getComponents();
        if (components == null) {
            return;
        }

        for (MixComponent component : components) {
            Product product = component.getProduct();
            if (product == null || product.getId() == null) {
                throw new IllegalArgumentException("Cada componente debe tener un producto válido");
            }

            Product managedProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + product.getId()));
            component.setProduct(managedProduct);
            component.setCustomMix(customMix);
        }
    }
}
