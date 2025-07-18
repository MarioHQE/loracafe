package com.example.loracafe.dashboard.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    private EstadoPago estado;

    @Column(length = 255)
    private String referencia;

    @Column(name = "fecha_pago", updatable = false)
    private LocalDateTime fechaPago = LocalDateTime.now();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore
    private Pedido pedido;

    public enum MetodoPago {
        TARJETA,
        EFECTIVO,
        TRANSFERENCIA
    }

    public enum EstadoPago {
        APROBADO,
        RECHAZADO,
        PENDIENTE
    }
}