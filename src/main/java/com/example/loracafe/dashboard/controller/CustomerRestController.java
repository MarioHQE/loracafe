package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.dto.ClienteDashboardDto;
import com.example.loracafe.dashboard.service.CustomerDashboardService; // Importar el nuevo servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/customers")
public class CustomerRestController {

    // Inyectamos el nuevo servicio
    @Autowired
    private CustomerDashboardService customerDashboardService;

    /**
     * ¡MODIFICADO!
     * Obtiene todos los clientes con su total de pedidos calculado.
     * @return Una lista de DTOs de clientes.
     */
    @GetMapping
    public ResponseEntity<List<ClienteDashboardDto>> getAllCustomersWithOrderCount() {
        List<ClienteDashboardDto> clientes = customerDashboardService.getClientesConTotalPedidos();
        return ResponseEntity.ok(clientes);
    }
    
    // La función de búsqueda necesitaría una lógica similar,
    // por ahora la dejamos comentada para simplificar.
    /*
    @GetMapping("/search")
    public ResponseEntity<List<ClienteDashboardDto>> searchCustomers(@RequestParam String term) {
        // ...
    }
    */
}