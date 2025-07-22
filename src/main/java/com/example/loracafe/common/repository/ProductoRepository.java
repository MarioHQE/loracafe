package com.example.loracafe.common.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Producto;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer>, JpaSpecificationExecutor<Producto> {

    long count();

    List<Producto> findByCategoriaId(Integer categoriaId);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // NUEVOS MÉTODOS PARA EL CLIENTE:
    List<Producto> findByDisponibleTrue();
    List<Producto> findByDisponibleTrueAndCategoriaId(Integer categoriaId);
    Optional<Producto> findByIdAndDisponibleTrue(Integer id);
}