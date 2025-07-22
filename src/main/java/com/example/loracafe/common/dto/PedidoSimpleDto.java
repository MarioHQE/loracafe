package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Pedido;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PedidoSimpleDto {
    private Integer id;
    private LocalDateTime fechaPedido;
    private BigDecimal total;
    private String estado;

    public PedidoSimpleDto(Pedido pedido) {
        this.id = pedido.getId();
        this.fechaPedido = pedido.getFechaPedido();
        this.total = pedido.getTotal();
        this.estado = pedido.getEstado().name().replace('_', ' ');
    }
}