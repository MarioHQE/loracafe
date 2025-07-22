package com.example.loracafe.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Mensaje;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findAllByOrderByFechaEnvioDesc();

    List<Mensaje> findTop5ByOrderByFechaEnvioDesc();

    long countByVistoFalse();
    // Dentro de la interfaz MensajeRepository.java
List<Mensaje> findByUsuarioIdOrderByFechaEnvioDesc(Integer usuarioId);

// Dentro de la interfaz MensajeRepository.java

// Spring Data JPA creará la consulta: SELECT count(*) FROM mensaje WHERE estado = ?
long countByEstado(Mensaje.EstadoMensaje estado);
}