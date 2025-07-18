package com.example.loracafe.dashboard.controller;

import com.example.loracafe.dashboard.entity.Pedido;
import com.example.loracafe.dashboard.entity.Pedido.EstadoPedido;
import com.example.loracafe.dashboard.service.PedidoService;
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
@RequestMapping("/api/orders")
public class OrderRestController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<Page<Pedido>> getAllPedidos(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            Pageable pageable) {

        Specification<Pedido> spec = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (status != null && !status.equalsIgnoreCase("all")) {
            try {
                EstadoPedido estadoPedido = EstadoPedido.valueOf(status.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("estado"), estadoPedido));
            } catch (IllegalArgumentException e) {
            }
        }

        if (date != null && !date.isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
                spec = spec.and((root, query, cb) -> 
                    cb.between(root.get("fechaPedido"), localDate.atStartOfDay(), localDate.atTime(23, 59, 59))
                );
            } catch(Exception e) {
            }
        }
        
        Page<Pedido> pedidos = pedidoService.getAllPedidos(spec, pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Integer id) {
        return pedidoService.getPedidoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> updateOrderStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusUpdate) {
        String nuevoEstadoStr = statusUpdate.get("status");
        if (nuevoEstadoStr == null || nuevoEstadoStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(nuevoEstadoStr.toUpperCase());
            
            Optional<Pedido> pedidoOptional = pedidoService.getPedidoById(id);
            if (!pedidoOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Pedido pedido = pedidoOptional.get();
            pedido.setEstado(nuevoEstado);
            
            Pedido pedidoActualizado = pedidoService.savePedido(pedido);
            return ResponseEntity.ok(pedidoActualizado);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}