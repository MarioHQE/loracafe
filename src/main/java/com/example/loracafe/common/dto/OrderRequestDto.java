package com.example.loracafe.common.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

// Representa la solicitud de pedido completa que envía el frontend
@Getter
@Setter
public class OrderRequestDto {
    private List<OrderItemDto> items;
    // Podríamos añadir aquí los datos del formulario de pago (nombre, dirección, etc.)
    private String direccionEntrega;
    private String notas;
}