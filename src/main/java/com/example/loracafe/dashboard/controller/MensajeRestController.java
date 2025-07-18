package com.example.loracafe.dashboard.controller;

import com.example.loracafe.dashboard.entity.Mensaje;
import com.example.loracafe.dashboard.service.MensajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MensajeRestController {

    @Autowired
    private MensajeService mensajeService;

    @GetMapping
    public ResponseEntity<List<Mensaje>> getAllMessages() {
        return ResponseEntity.ok(mensajeService.getAllMensajes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mensaje> getMessageById(@PathVariable Integer id) {
        return mensajeService.getMensajeById(id)
                .map(mensaje -> {
                    // Al obtenerlo para verlo, lo marcamos como LEIDO si es NUEVO
                    if (mensaje.getEstado() == Mensaje.EstadoMensaje.NUEVO) {
                        return ResponseEntity.ok(mensajeService.marcarComoLeido(id));
                    }
                    return ResponseEntity.ok(mensaje);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/reply")
    public ResponseEntity<Mensaje> replyToMessage(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String respuesta = body.get("respuesta");
        if (respuesta == null || respuesta.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Mensaje mensajeRespondido = mensajeService.responderMensaje(id, respuesta);
            return ResponseEntity.ok(mensajeRespondido);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer id) {
        mensajeService.deleteMensaje(id);
        return ResponseEntity.noContent().build();
    }
}