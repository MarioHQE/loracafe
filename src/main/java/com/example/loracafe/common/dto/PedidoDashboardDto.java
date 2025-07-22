package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Pedido;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class PedidoDashboardDto {

    private Integer id;
    private String clienteNombre;
    private LocalDateTime fechaPedido;
    private List<String> productos; // Una lista simple de strings
    private BigDecimal total;
    private String estado;

    public PedidoDashboardDto(Pedido pedido) {
        this.id = pedido.getId();
        // Comprobamos si el usuario no es nulo
        if (pedido.getUsuario() != null) {
            this.clienteNombre = pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido();
        } else {
            this.clienteNombre = "Cliente Anónimo";
        }
        this.fechaPedido = pedido.getFechaPedido();
        this.total = pedido.getTotal();
        this.estado = pedido.getEstado().name(); // Devolvemos el nombre del enum
        
        // Mapeamos los detalles a una lista de strings simples
        if (pedido.getDetalles() != null) {
            this.productos = pedido.getDetalles().stream()
                    .map(detalle -> detalle.getCantidad() + " x " + detalle.getProducto().getNombre())
                    .collect(Collectors.toList());
        }
    }
}