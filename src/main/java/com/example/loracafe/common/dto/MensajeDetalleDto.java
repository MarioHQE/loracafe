package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Mensaje;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO para mostrar la vista detallada de un mensaje en el dashboard.
 * Incluye la respuesta, a diferencia del DTO de la lista.
 */
@Getter
@Setter
@NoArgsConstructor
public class MensajeDetalleDto {

    private Integer id;
    private String nombre;
    private String email;
    private String asunto;
    private String mensaje;
    private String respuesta;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaRespuesta;
    private Mensaje.EstadoMensaje estado;

    // Constructor para convertir de Entidad a DTO
    public MensajeDetalleDto(Mensaje mensaje) {
        this.id = mensaje.getId();
        this.nombre = mensaje.getNombre();
        this.email = mensaje.getEmail();
        this.asunto = mensaje.getAsunto();
        this.mensaje = mensaje.getMensaje();
        this.respuesta = mensaje.getRespuesta();
        this.fechaEnvio = mensaje.getFechaEnvio();
        this.fechaRespuesta = mensaje.getFechaRespuesta();
        this.estado = mensaje.getEstado();
    }
}