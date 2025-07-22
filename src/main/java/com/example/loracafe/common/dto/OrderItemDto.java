package com.example.loracafe.common.dto;

import lombok.Getter;
import lombok.Setter;

// Representa un solo ítem en el carrito de compra
@Getter
@Setter
public class OrderItemDto {
    private Integer productoId;
    private int cantidad;
}