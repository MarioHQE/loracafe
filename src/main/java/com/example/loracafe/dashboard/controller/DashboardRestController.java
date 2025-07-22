package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.dto.NotificacionDto;
import com.example.loracafe.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardRestController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Endpoint para obtener los datos de los gráficos del dashboard principal.
     */
    @GetMapping("/chart-data")
    public ResponseEntity<Map<String, Object>> getChartData() {
        Map<String, Object> chartData = dashboardService.getChartData();
        return ResponseEntity.ok(chartData);
    }
    
    /**
     * Endpoint para obtener los datos de los gráficos y tablas de la página de analíticas.
     */
    @GetMapping("/analytics-data")
    public ResponseEntity<Map<String, Object>> getAnalyticsData() {
        Map<String, Object> analyticsData = dashboardService.getAnalyticsData();
        return ResponseEntity.ok(analyticsData);
    }

    /**
     * ¡¡NUEVO ENDPOINT AÑADIDO!!
     * API para obtener la lista de notificaciones recientes para el dashboard.
     * @return Una lista de hasta 5 notificaciones (pedidos y mensajes).
     */
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificacionDto>> getNotifications() {
        List<NotificacionDto> notificaciones = dashboardService.getNotificaciones();
        return ResponseEntity.ok(notificaciones);
    }

    // Dentro de DashboardRestController.java

    /**
     * ¡NUEVO!
     * Endpoint para obtener el conteo de notificaciones no leídas.
     */
    @GetMapping("/notifications/summary")
    public ResponseEntity<Map<String, Long>> getNotificationSummary() {
        return ResponseEntity.ok(dashboardService.getNotificationSummary());
    }

    /**
     * ¡NUEVO!
     * Endpoint para marcar todas las notificaciones como leídas.
     */
    @PostMapping("/notifications/mark-as-read")
    public ResponseEntity<Void> markNotificationsAsRead() {
        dashboardService.markAllNotificationsAsRead();
        return ResponseEntity.ok().build();
    }
}