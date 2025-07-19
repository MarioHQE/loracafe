package com.example.loracafe.controller;

import com.example.loracafe.entity.Usuario;
import com.example.loracafe.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsers() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUserById(@PathVariable Integer id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> createUser(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.saveUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUser(@PathVariable Integer id, @RequestBody Usuario userDetails) {
        Optional<Usuario> userOptional = usuarioService.getUsuarioById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuarioExistente = userOptional.get();
        usuarioExistente.setNombre(userDetails.getNombre());
        usuarioExistente.setApellido(userDetails.getApellido());
        usuarioExistente.setEmail(userDetails.getEmail());
        usuarioExistente.setRol(userDetails.getRol());
        usuarioExistente.setActivo(userDetails.isActivo());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            usuarioExistente.setPassword(userDetails.getPassword());
        }

        Usuario usuarioActualizado = usuarioService.saveUsuario(usuarioExistente);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        if (!usuarioService.getUsuarioById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

}