package com.example.loracafe.dashboard.repository;


import com.example.loracafe.dashboard.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    long count();

    List<Producto> findByCategoriaId(Integer categoriaId);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}