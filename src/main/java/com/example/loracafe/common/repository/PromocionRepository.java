package com.example.loracafe.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Promocion;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {

    /**
     * Busca todas las promociones que están activas y cuya fecha actual
     * está dentro del rango de fecha_inicio y fecha_fin.
     * Spring Data JPA genera la consulta automáticamente a partir del nombre del método.
     * @param fechaInicioReferencia La fecha y hora actual para comparar con fecha_inicio.
     * @param fechaFinReferencia La fecha y hora actual para comparar con fecha_fin.
     * @return Una lista de promociones válidas.
     */
    List<Promocion> findByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}