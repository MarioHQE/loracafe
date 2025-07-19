package com.example.loracafe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/protected")
@CrossOrigin(origins = "*")
public class ProtectedController {

    @GetMapping("/user")
    @PreAuthorize("hasRole('CLIENTE') or hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<String> userAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Acceso permitido para usuario: " + auth.getName());
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Acceso permitido para administrador: " + auth.getName());
    }

    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<String> staffAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Acceso permitido para staff: " + auth.getName());
    }

    @GetMapping("/profile")
    public ResponseEntity<String> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Perfil del usuario: " + auth.getName() +
                " con roles: " + auth.getAuthorities());
    }
}