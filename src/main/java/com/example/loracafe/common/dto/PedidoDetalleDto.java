package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.DetallePedido;
import com.example.loracafe.common.entity.Pedido;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class PedidoDetalleDto {
    private Integer id;
    private String clienteNombre;
    private LocalDateTime fechaPedido;
    private BigDecimal total;
    private String estado;
    private String direccionEntrega;
    private List<DetalleItemDto> detalles;

    @Getter
    @Setter
    public static class DetalleItemDto {
        private String productoNombre;
        private int cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;

        public DetalleItemDto(DetallePedido detalle) {
            this.productoNombre = detalle.getProducto().getNombre();
            this.cantidad = detalle.getCantidad();
            this.precioUnitario = detalle.getPrecioUnitario();
            this.subtotal = detalle.getSubtotal();
        }
    }

    public PedidoDetalleDto(Pedido pedido) {
        this.id = pedido.getId();
        this.clienteNombre = pedido.getUsuario() != null ? pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido() : "N/A";
        this.fechaPedido = pedido.getFechaPedido();
        this.total = pedido.getTotal();
        this.estado = pedido.getEstado().name();
        this.direccionEntrega = pedido.getDireccionEntrega();
        if (pedido.getDetalles() != null) {
            this.detalles = pedido.getDetalles().stream()
                .map(DetalleItemDto::new)
                .collect(Collectors.toList());
        }
    }
}