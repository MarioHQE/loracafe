package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Producto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO para mostrar los productos en la carta del cliente.
 * Es un objeto plano para evitar bucles de serialización.
 */
@Getter
@Setter
public class ProductoClienteDto {
    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String imagenUrl;
    private String categoriaNombre;

    public ProductoClienteDto(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.imagenUrl = producto.getImagenUrl();
        if (producto.getCategoria() != null) {
            this.categoriaNombre = producto.getCategoria().getNombre();
        }
    }
}