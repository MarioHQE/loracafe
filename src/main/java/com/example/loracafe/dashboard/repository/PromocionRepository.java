package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {

    /**
      @param ahora
      @return
     */
    List<Promocion> findByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(LocalDateTime ahora, LocalDateTime ahora2);
}