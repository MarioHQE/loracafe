package com.example.loracafe.dashboard.service;

import com.example.loracafe.dashboard.entity.Mensaje;
import com.example.loracafe.dashboard.repository.MensajeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    public List<Mensaje> getAllMensajes() {
        return mensajeRepository.findAllByOrderByFechaEnvioDesc();
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
            .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));

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
}