package com.example.loracafe.common.service; // <-- Paquete corregido a 'common'

import com.example.loracafe.common.dto.MensajeDto;
import com.example.loracafe.common.entity.Mensaje;
import com.example.loracafe.common.repository.MensajeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    /**
     * ¡¡MÉTODO MODIFICADO!!
     * Obtiene todos los mensajes y los convierte a DTOs para el dashboard,
     * evitando problemas de serialización JSON.
     * @return Una lista de MensajeDto.
     */
    public List<MensajeDto> getAllMensajes() {
        List<Mensaje> mensajes = mensajeRepository.findAllByOrderByFechaEnvioDesc();
        
        // Convertimos cada entidad 'Mensaje' a un 'MensajeDto'
        return mensajes.stream()
                .map(MensajeDto::new) // Utiliza el constructor que creamos en el DTO
                .collect(Collectors.toList());
    }

    public Optional<Mensaje> getMensajeById(Integer id) {
        return mensajeRepository.findById(id);
    }

    @Transactional
    public Mensaje marcarComoLeido(Integer id) {
        Mensaje mensaje = mensajeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        
        if (mensaje.getEstado() == Mensaje.EstadoMensaje.NUEVO) {
            mensaje.setEstado(Mensaje.EstadoMensaje.LEIDO);
        }
        return mensajeRepository.save(mensaje);
    }

    @Transactional
    public Mensaje responderMensaje(Integer id, String respuesta) {
        Mensaje mensaje = mensajeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mensaje no encontrado con id: " + id));

        mensaje.setRespuesta(respuesta);
        mensaje.setEstado(Mensaje.EstadoMensaje.RESPONDIDO);
        mensaje.setFechaRespuesta(LocalDateTime.now());
        
        return mensajeRepository.save(mensaje);
    }
    
    public Mensaje guardarNuevoMensaje(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }
    
    public void deleteMensaje(Integer id) {
        mensajeRepository.deleteById(id);
    }

    public List<Mensaje> getMensajesByUsuario(Integer usuarioId) {
        return mensajeRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }
}