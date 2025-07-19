package com.example.loracafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.Promocion;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {

  /**
   * @param ahora
   * @return
   */
  List<Promocion> findByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(LocalDateTime ahora, LocalDateTime ahora2);
}