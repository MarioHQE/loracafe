package com.example.loracafe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensaje")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 200)
    private String asunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(columnDefinition = "TEXT")
    private String respuesta;

    @Column(updatable = false)
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    private LocalDateTime fechaRespuesta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMensaje estado = EstadoMensaje.NUEVO;

    public enum EstadoMensaje {
        NUEVO,
        LEIDO,
        RESPONDIDO
    }
}