package com.example.loracafe.dashboard.controller;

import com.example.loracafe.dashboard.entity.Usuario;
import com.example.loracafe.dashboard.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerRestController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     @return
     */
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllCustomers() {
        List<Usuario> todosLosUsuarios = usuarioService.getAllUsuarios();

        List<Usuario> clientes = todosLosUsuarios.stream()
                .filter(usuario -> usuario.getRol() == Usuario.Rol.CLIENTE)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(clientes);
    }
    
    
}