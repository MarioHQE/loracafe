package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findAllByOrderByFechaEnvioDesc();
}