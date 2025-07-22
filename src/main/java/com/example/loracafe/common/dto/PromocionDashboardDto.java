package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Promocion;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PromocionDashboardDto {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Promocion.TipoPromocion tipo;
    private BigDecimal descuento;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private boolean activa;

    public PromocionDashboardDto(Promocion promocion) {
        this.id = promocion.getId();
        this.nombre = promocion.getNombre();
        this.descripcion = promocion.getDescripcion();
        this.tipo = promocion.getTipo();
        this.descuento = promocion.getDescuento();
        this.fechaInicio = promocion.getFechaInicio();
        this.fechaFin = promocion.getFechaFin();
        this.activa = promocion.isActiva();
    }
}