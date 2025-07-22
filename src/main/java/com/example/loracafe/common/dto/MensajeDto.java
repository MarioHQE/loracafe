package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Mensaje;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO para mostrar la lista de mensajes en el dashboard.
 * Simplifica la entidad Mensaje para evitar problemas de serialización.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MensajeDto {
    
    private Integer id;
    private String nombre;
    private String email;
    private String asunto;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Mensaje.EstadoMensaje estado;

    // Constructor para convertir fácilmente de Entidad a DTO
    public MensajeDto(Mensaje mensaje) {
        this.id = mensaje.getId();
        this.nombre = mensaje.getNombre();
        this.email = mensaje.getEmail();
        this.asunto = mensaje.getAsunto();
        this.mensaje = mensaje.getMensaje();
        this.fechaEnvio = mensaje.getFechaEnvio();
        this.estado = mensaje.getEstado();
    }
}