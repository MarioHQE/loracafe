package com.example.loracafe.controller;

import com.example.loracafe.dto.AuthRequest;
import com.example.loracafe.dto.AuthResponse;
import com.example.loracafe.dto.RegisterRequest;
import com.example.loracafe.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return ResponseEntity.ok("Token válido");
        }
        return ResponseEntity.badRequest().body("Token inválido");
    }
}