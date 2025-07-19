package com.example.loracafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.Categoria;

import java.util.List;

/**
 * 
 * @param Categoria
 * @param Integer
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

  /**
   * 
   * @param activa
   * @return
   */
  List<Categoria> findByActiva(boolean activa);
}