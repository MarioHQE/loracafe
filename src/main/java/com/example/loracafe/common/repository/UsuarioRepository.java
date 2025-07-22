package com.example.loracafe.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.entity.Usuario.Rol;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;



@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
      @param email
      @return
     */
    Optional<Usuario> findByEmail(String email);

    /**
      @param fecha
      @return
     */
    long countByFechaRegistroAfter(LocalDateTime fecha);

    /**
      @param rol 
      @return 
     */
    long countByRol(Usuario.Rol rol);

    long countByRolAndFechaRegistroAfter(Usuario.Rol rol, LocalDateTime fecha);

    @Query("SELECT u FROM Usuario u WHERE u.nombre LIKE %?1% OR u.apellido LIKE %?1% OR u.email LIKE %?1%")
List<Usuario> searchByTerm(String term);

    
    List<Usuario> findByRolOrderByFechaRegistroDesc(Rol rol);
}