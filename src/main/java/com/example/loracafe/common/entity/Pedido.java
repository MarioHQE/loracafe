package com.example.loracafe.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    @Column(name = "direccion_entrega", nullable = false, length = 255)
    private String direccionEntrega;

    @Column(name = "fecha_pedido", updatable = false)
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(nullable = false)
    private boolean visto = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetallePedido> detalles;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Pago pago;

    public enum EstadoPedido {
        PENDIENTE,
        EN_PROCESO,
        PAGADO,
        COMPLETADO,
        CANCELADO
    }
}