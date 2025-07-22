package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Mensaje;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MensajeClienteDto {
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private String respuesta;
    private LocalDateTime fechaRespuesta;

    public MensajeClienteDto(Mensaje mensaje) {
        this.mensaje = mensaje.getMensaje();
        this.fechaEnvio = mensaje.getFechaEnvio();
        this.respuesta = mensaje.getRespuesta();
        this.fechaRespuesta = mensaje.getFechaRespuesta();
    }
}