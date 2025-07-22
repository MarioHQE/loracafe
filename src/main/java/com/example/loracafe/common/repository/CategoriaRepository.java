package com.example.loracafe.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Categoria;

import java.util.List;

/**
 
  @param Categoria 
  @param Integer 
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    /**
     
      @param activa
      @return
     */
    List<Categoria> findByActiva(boolean activa);

    // NUEVO MÉTODO PARA EL CLIENTE:
    List<Categoria> findByActivaTrue();
}