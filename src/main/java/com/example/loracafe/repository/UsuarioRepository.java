package com.example.loracafe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.Usuario;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

  /**
   * @param email
   * @return
   */
  Optional<Usuario> findByEmail(String email);

  /**
   * @param fecha
   * @return
   */
  long countByFechaRegistroAfter(LocalDateTime fecha);

  /**
   * @param rol
   * @return
   */
  long countByRol(Usuario.Rol rol);

  long countByRolAndFechaRegistroAfter(Usuario.Rol rol, LocalDateTime fecha);
}