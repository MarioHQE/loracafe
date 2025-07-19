package com.example.loracafe.service;

import com.example.loracafe.entity.Usuario;
import com.example.loracafe.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * @return
     */
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * @param id
     * @return
     */
    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    /**
     * @param email
     * @return
     */
    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    /**
     * @param usuario
     * @return
     */
    @Transactional
    public Usuario saveUsuario(Usuario usuario) {

        return usuarioRepository.save(usuario);
    }

    /**
     * @param id
     */
    @Transactional
    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

}