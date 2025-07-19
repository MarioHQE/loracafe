package com.example.loracafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.Producto;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    long count();

    List<Producto> findByCategoriaId(Integer categoriaId);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}