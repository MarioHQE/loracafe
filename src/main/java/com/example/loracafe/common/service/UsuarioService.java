package com.example.loracafe.common.service;

import com.example.loracafe.common.dto.UserProfileDto; // Importar DTO
import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario registrarNuevoCliente(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalStateException("El correo electrónico ya está registrado.");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Usuario.Rol.CLIENTE);
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    /**
     * ¡¡NUEVO MÉTODO!!
     * Actualiza los datos del perfil de un usuario existente.
     * 
     * @param emailActual El email actual del usuario para identificarlo.
     * @param profileDto  El DTO con los nuevos datos del perfil.
     * @return El usuario actualizado.
     */
    @Transactional
    public Usuario updateUserProfile(String emailActual, UserProfileDto profileDto) {
        Usuario usuario = usuarioRepository.findByEmail(emailActual)
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado."));

        // Validación: Si el email ha cambiado, verificar que el nuevo no esté ya
        // registrado.
        if (!emailActual.equals(profileDto.getEmail())) {
            if (usuarioRepository.findByEmail(profileDto.getEmail()).isPresent()) {
                throw new IllegalStateException("El nuevo correo electrónico ya está en uso.");
            }
            usuario.setEmail(profileDto.getEmail());
        }

        // Actualizar el resto de los campos.
        usuario.setNombre(profileDto.getNombre());
        usuario.setApellido(profileDto.getApellido());
        usuario.setTelefono(profileDto.getTelefono());
        usuario.setDireccion(profileDto.getDireccion());

        return usuarioRepository.save(usuario);
    }

    // --- Métodos existentes ---

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> searchUsuarios(String term) {
        return usuarioRepository.searchByTerm(term);
    }

    /**
     * ¡¡MÉTODO MEJORADO!!
     * Guarda/actualiza un usuario desde el Dashboard.
     * Si se proporciona una nueva contraseña, la cifra antes de guardarla.
     * Si la contraseña está vacía, mantiene la existente.
     * @param usuario El objeto usuario con los datos a guardar.
     * @return El usuario guardado.
     */
    @Transactional
    public Usuario saveUsuario(Usuario usuario) {
        // Verificamos si es una actualización (si ya tiene un ID)
        if (usuario.getId() != null) {
            // Buscamos el usuario existente en la base de datos
            Usuario usuarioExistente = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));
            
            // Si se proporcionó una nueva contraseña en el formulario...
            if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
                // ...la ciframos y la establecemos.
                usuarioExistente.setPassword(passwordEncoder.encode(usuario.getPassword()));
            }
            // Si no se proporcionó una nueva contraseña, simplemente no tocamos la existente.
            
            // Actualizamos los otros campos
            usuarioExistente.setNombre(usuario.getNombre());
            usuarioExistente.setApellido(usuario.getApellido());
            usuarioExistente.setEmail(usuario.getEmail());
            usuarioExistente.setRol(usuario.getRol());
            usuarioExistente.setActivo(usuario.isActivo());

            return usuarioRepository.save(usuarioExistente);

        } else {
            // Si es un usuario nuevo (no tiene ID), ciframos la contraseña obligatoriamente.
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            return usuarioRepository.save(usuario);
        }
    }

    @Transactional
    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }
}