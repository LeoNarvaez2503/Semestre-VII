package com.kairosmix.infrastructure.persistence;

import com.kairosmix.domain.entities.CustomMix;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CustomMixRepositoryAdapterTest {

    @Autowired
    private CustomMixRepositoryAdapter customMixRepositoryAdapter;

    private CustomMix testCustomMix;

    @BeforeEach
    void setUp() {
        testCustomMix = CustomMix.builder()
            .name("Test Mix")
            .description("Test mix description")
            .totalPrice(java.math.BigDecimal.valueOf(20.0))
            .build();
    }

    @Test
    void testSaveCustomMix() {
        CustomMix saved = customMixRepositoryAdapter.save(testCustomMix);
        
        assertNotNull(saved.getId());
        assertEquals(testCustomMix.getName(), saved.getName());
        assertEquals(testCustomMix.getDescription(), saved.getDescription());
    }

    @Test
    void testFindCustomMixById() {
        CustomMix saved = customMixRepositoryAdapter.save(testCustomMix);
        Optional<CustomMix> found = customMixRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
    }

    @Test
    void testFindAllCustomMixes() {
        customMixRepositoryAdapter.save(testCustomMix);
        List<CustomMix> all = customMixRepositoryAdapter.findAll();
        
        assertFalse(all.isEmpty());
        assertTrue(all.stream().anyMatch(m -> m.getName().equals("Test Mix")));
    }

    @Test
    void testDeleteCustomMix() {
        CustomMix saved = customMixRepositoryAdapter.save(testCustomMix);
        customMixRepositoryAdapter.delete(saved);
        Optional<CustomMix> found = customMixRepositoryAdapter.findById(saved.getId());
        
        assertTrue(found.isEmpty());
    }

    @Test
    void testUpdateCustomMix() {
        CustomMix saved = customMixRepositoryAdapter.save(testCustomMix);
        saved.setName("Updated Mix");
        CustomMix updated = customMixRepositoryAdapter.save(saved);
        
        assertEquals("Updated Mix", updated.getName());
    }
}
