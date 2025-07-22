package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Usuario;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClienteDashboardDto {

    private Integer id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDateTime fechaRegistro;
    private long totalPedidos; // ¡El nuevo campo calculado!

    public ClienteDashboardDto(Usuario usuario, long totalPedidos) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.fechaRegistro = usuario.getFechaRegistro();
        this.totalPedidos = totalPedidos;
    }
}