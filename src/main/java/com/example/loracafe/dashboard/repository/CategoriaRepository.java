package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}