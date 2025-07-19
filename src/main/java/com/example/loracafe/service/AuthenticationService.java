package com.example.loracafe.service;

import com.example.loracafe.dto.AuthRequest;
import com.example.loracafe.dto.AuthResponse;
import com.example.loracafe.dto.RegisterRequest;
import com.example.loracafe.entity.Usuario;
import com.example.loracafe.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .rol(Usuario.Rol.CLIENTE)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .rol(user.getRol().name())
                .message("Usuario registrado exitosamente")
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .rol(user.getRol().name())
                .message("Autenticación exitosa")
                .build();
    }
}