package com.example.loracafe.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Esta clase es un "contenedor" simple para los datos del perfil del usuario.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String direccion;
}