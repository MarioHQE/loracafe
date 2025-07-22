package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.dto.MensajeDetalleDto;
import com.example.loracafe.common.dto.MensajeDto;
import com.example.loracafe.common.entity.Mensaje;
import com.example.loracafe.common.service.MensajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard/messages")
public class MensajeRestController {

    @Autowired
    private MensajeService mensajeService;

    /**
     * Devuelve una lista de todos los mensajes en un formato de DTO simplificado,
     * optimizado para la vista de tabla.
     */
    @GetMapping
    public ResponseEntity<List<MensajeDto>> getAllMessages() {
        List<MensajeDto> mensajesDto = mensajeService.getAllMensajes();
        return ResponseEntity.ok(mensajesDto);
    }

    /**
     * Obtiene los detalles completos de un solo mensaje usando un DTO.
     * Al ser consultado, marca el mensaje como LEIDO si su estado era NUEVO.
     * @param id El ID del mensaje a obtener.
     * @return Un DTO detallado del mensaje (MensajeDetalleDto).
     */
    @GetMapping("/{id}")
    public ResponseEntity<MensajeDetalleDto> getMessageById(@PathVariable Integer id) {
        Optional<Mensaje> mensajeOptional = mensajeService.getMensajeById(id);

        if (mensajeOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Mensaje mensaje = mensajeOptional.get();
        
        if (mensaje.getEstado() == Mensaje.EstadoMensaje.NUEVO) {
            mensaje = mensajeService.marcarComoLeido(id);
        }

        MensajeDetalleDto dto = new MensajeDetalleDto(mensaje);
        return ResponseEntity.ok(dto);
    }
    
    /**
     * ¡¡MÉTODO CORREGIDO!!
     * Procesa la respuesta de un administrador a un mensaje.
     * Guarda la respuesta y devuelve un DTO detallado del mensaje actualizado.
     * @param id El ID del mensaje original.
     * @param body Un mapa que debe contener la clave "respuesta" con el texto.
     * @return Un DTO del mensaje actualizado con la respuesta.
     */
    @PostMapping("/{id}/reply")
    public ResponseEntity<MensajeDetalleDto> replyToMessage(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String respuesta = body.get("respuesta");
        if (respuesta == null || respuesta.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            // 1. El servicio guarda la respuesta y devuelve la entidad actualizada.
            Mensaje mensajeRespondido = mensajeService.responderMensaje(id, respuesta);
            
            // 2. Convertimos la entidad a un DTO seguro antes de enviarla como respuesta.
            MensajeDetalleDto dto = new MensajeDetalleDto(mensajeRespondido);
            
            // 3. Devolvemos el DTO.
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            // Esto se ejecuta si el MensajeService lanza una excepción (ej. "Mensaje no encontrado").
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Elimina un mensaje por su ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer id) {
        Optional<Mensaje> mensajeOptional = mensajeService.getMensajeById(id);
        if (mensajeOptional.isPresent()) {
            mensajeService.deleteMensaje(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}