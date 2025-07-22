package com.example.loracafe.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class NotificacionDto {
    private String tipo; // "PEDIDO" o "MENSAJE"
    private String texto;
    private LocalDateTime fecha;
    private String url; // Enlace para ir al detalle
}