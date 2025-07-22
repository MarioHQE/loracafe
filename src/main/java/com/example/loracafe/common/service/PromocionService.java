package com.example.loracafe.common.service; // <-- PAQUETE CORREGIDO

import com.example.loracafe.common.entity.Promocion;
import com.example.loracafe.common.dto.PromocionDashboardDto;
import com.example.loracafe.common.repository.PromocionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromocionService {

    @Autowired
    private PromocionRepository promocionRepository;

    // Para el Dashboard
        public List<PromocionDashboardDto> getAllPromocionesDto() {
        return promocionRepository.findAll()
                .stream()
                .map(PromocionDashboardDto::new)
                .collect(Collectors.toList());
    }


    public Optional<Promocion> getPromocionById(Integer id) {
        return promocionRepository.findById(id);
    }

    @Transactional
    public Promocion savePromocion(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    @Transactional
    public void deletePromocion(Integer id) {
        promocionRepository.deleteById(id);
    }

    // Para el Cliente
    public List<Promocion> getActivePromociones() {
        LocalDateTime ahora = LocalDateTime.now();
        return promocionRepository.findByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(ahora, ahora);
    }
}