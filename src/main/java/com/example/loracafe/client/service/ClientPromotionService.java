package com.example.loracafe.client.service;

import com.example.loracafe.common.dto.PromocionClienteDto;
import com.example.loracafe.common.repository.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientPromotionService {

    @Autowired
    private PromocionRepository promocionRepository;
    
    public List<PromocionClienteDto> getActivePromotions() {
        LocalDateTime ahora = LocalDateTime.now();
        return promocionRepository.findByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(ahora, ahora)
                .stream()
                // Filtramos para asegurarnos de que la promoción tenga al menos un producto asociado
                .filter(promo -> promo.getProductos() != null && !promo.getProductos().isEmpty())
                .map(PromocionClienteDto::new)
                .collect(Collectors.toList());
    }
}