package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.dto.PedidoDashboardDto;
import com.example.loracafe.common.dto.PedidoDetalleDto; // DTO para la vista detallada
import com.example.loracafe.common.entity.Pedido;
import com.example.loracafe.common.entity.Pedido.EstadoPedido;
import com.example.loracafe.common.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard/orders")
public class OrderRestController {

    @Autowired
    private PedidoService pedidoService;

    /**
     * ¡¡MÉTODO CORREGIDO!!
     * Obtiene todos los pedidos de forma paginada y convertidos a DTOs para evitar errores de serialización.
     * @return Una página de PedidoDashboardDto.
     */
    @GetMapping
    public ResponseEntity<Page<PedidoDashboardDto>> getAllPedidos(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            Pageable pageable) {

        Specification<Pedido> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (status != null && !status.equalsIgnoreCase("all")) {
            try {
                EstadoPedido estadoPedido = EstadoPedido.valueOf(status.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("estado"), estadoPedido));
            } catch (IllegalArgumentException e) { /* Ignorar estado inválido */ }
        }

        if (date != null && !date.isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
                spec = spec.and((root, query, cb) -> 
                    cb.between(root.get("fechaPedido"), localDate.atStartOfDay(), localDate.atTime(23, 59, 59))
                );
            } catch(Exception e) { /* Ignorar fecha inválida */ }
        }
        
        // 1. Obtenemos la página de entidades Pedido.
        Page<Pedido> pedidosPage = pedidoService.getAllPedidos(spec, pageable);

        // 2. Convertimos la página de entidades a una página de DTOs.
        Page<PedidoDashboardDto> pedidosDtoPage = pedidosPage.map(PedidoDashboardDto::new);
        
        // 3. Devolvemos la página de DTOs.
        return ResponseEntity.ok(pedidosDtoPage);
    }

    /**
     * ¡¡MÉTODO CORREGIDO!!
     * Obtiene los detalles de un solo pedido usando un DTO.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalleDto> getPedidoById(@PathVariable Integer id) {
        return pedidoService.getPedidoById(id)
                .map(pedido -> ResponseEntity.ok(new PedidoDetalleDto(pedido)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ¡¡MÉTODO CORREGIDO!!
     * Actualiza el estado de un pedido y devuelve el pedido actualizado como un DTO.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoDashboardDto> updateOrderStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusUpdate) {
        String nuevoEstadoStr = statusUpdate.get("status");
        if (nuevoEstadoStr == null || nuevoEstadoStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(nuevoEstadoStr.toUpperCase());
            
            Optional<Pedido> pedidoOptional = pedidoService.getPedidoById(id);
            if (pedidoOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Pedido pedido = pedidoOptional.get();
            pedido.setEstado(nuevoEstado);
            
            Pedido pedidoActualizado = pedidoService.savePedido(pedido);
            // Devolvemos el DTO actualizado
            return ResponseEntity.ok(new PedidoDashboardDto(pedidoActualizado));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}