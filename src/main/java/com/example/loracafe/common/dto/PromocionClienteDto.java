package com.example.loracafe.common.dto;

import com.example.loracafe.common.entity.Producto;
import com.example.loracafe.common.entity.Promocion;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Getter
@Setter
public class PromocionClienteDto {
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private ProductoSimpleDto producto; // Usaremos un DTO simple para el producto

    @Getter
    @Setter
    public static class ProductoSimpleDto {
        private Integer id;
        private String nombre;
        private String imagenUrl;
        private BigDecimal precioOriginal;
        private BigDecimal precioFinal;

        public ProductoSimpleDto(Producto producto, Promocion promo) {
            this.id = producto.getId();
            this.nombre = producto.getNombre();
            this.imagenUrl = producto.getImagenUrl();
            this.precioOriginal = producto.getPrecio();
            
            // Calcular precio final
            if (promo.getTipo() == Promocion.TipoPromocion.PORCENTAJE) {
                BigDecimal descuento = this.precioOriginal.multiply(promo.getDescuento().divide(new BigDecimal(100)));
                this.precioFinal = this.precioOriginal.subtract(descuento).setScale(2, RoundingMode.HALF_UP);
            } else { // MONTO_FIJO
                this.precioFinal = promo.getDescuento(); // Asumimos que el "descuento" es el precio final
            }
        }
    }

    public PromocionClienteDto(Promocion promo) {
        this.nombre = promo.getNombre();
        this.descripcion = promo.getDescripcion();
        this.imagenUrl = promo.getImagenUrl();
        // Asumimos que cada promoción aplica a UN solo producto para simplificar la vista del cliente.
        // Si una promoción tuviera muchos productos, aquí la lógica sería diferente.
        if (promo.getProductos() != null && !promo.getProductos().isEmpty()) {
            Producto primerProducto = promo.getProductos().iterator().next();
            this.producto = new ProductoSimpleDto(primerProducto, promo);
        }
    }
}