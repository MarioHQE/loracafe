package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {

    /**
     @param usuarioId
     @return
     */
    List<Carrito> findByUsuarioId(Integer usuarioId);

    /**
      @param usuarioId 
      @param productoId
      @return
     */
    Optional<Carrito> findByUsuarioIdAndProductoId(Integer usuarioId, Integer productoId);
}