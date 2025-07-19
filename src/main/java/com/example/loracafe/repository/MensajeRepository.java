package com.example.loracafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.Mensaje;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findAllByOrderByFechaEnvioDesc();
}