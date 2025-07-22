package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Producto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductoDashboardDto {
    private Integer id;
    private String nombre;
    private String categoriaNombre;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private String imagenUrl;

    public ProductoDashboardDto(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.stock = producto.getStock();
        this.imagenUrl = producto.getImagenUrl();
        if (producto.getCategoria() != null) {
            this.categoriaNombre = producto.getCategoria().getNombre();
        } else {
            this.categoriaNombre = "Sin Categoría";
        }
    }
}