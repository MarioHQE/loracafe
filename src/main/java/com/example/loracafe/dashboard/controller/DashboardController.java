package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.service.UsuarioService;
import com.example.loracafe.common.dto.NotificacionDto;
import com.example.loracafe.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;


import java.util.Map;
import java.util.List;


@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UsuarioService usuarioService;


    // Ahora este método responde a GET /dashboard
    @GetMapping
    public String getDashboardPage(Model model) {
        addUserDetailsToModel(model);
        Map<String, Object> dashboardData = dashboardService.getDashboardData();
        model.addAllAttributes(dashboardData);
        model.addAttribute("page", "dashboard");
        return "Dashboard/index";
    }

    // Responde a GET /dashboard/products
    @GetMapping("/products")
    public String getProductsPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "products");
        return "Dashboard/index";
    }

    // Dentro de DashboardController.java

// Responde a GET /dashboard/promotions
@GetMapping("/promotions")
public String getPromotionsPage(Model model) {
    addUserDetailsToModel(model);
    model.addAttribute("page", "promotions"); // Para el menú
    return "Dashboard/index";
}

    // Responde a GET /dashboard/orders
    @GetMapping("/orders")
    public String getOrdersPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "orders");
        return "Dashboard/index";
    }

    // ... y así sucesivamente para los demás métodos ...
    // Responde a GET /dashboard/customers
    @GetMapping("/customers")
    public String getCustomersPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "customers");
        return "Dashboard/index";
    }
    
    // Y los que faltaban
    @GetMapping("/messages")
    public String getMessagesPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "messages");
        return "Dashboard/index";
    }

    @GetMapping("/users")
    public String getUsersPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "users");
        return "Dashboard/index";
    }

    @GetMapping("/analytics")
    public String getAnalyticsPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "analytics");
        return "Dashboard/index";
    }

    @GetMapping("/reports")
    public String getReportsPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "reports");
        return "Dashboard/index";
    }

    @GetMapping("/settings")
    public String getSettingsPage(Model model) {
        addUserDetailsToModel(model);
        model.addAttribute("page", "settings");
        return "Dashboard/index";
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificacionDto>> getNotifications() {
        return ResponseEntity.ok(dashboardService.getNotificaciones());
    }
    private void addUserDetailsToModel(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            usuarioService.getUsuarioByEmail(email).ifPresent(usuario -> {
                model.addAttribute("usuarioLogueado", usuario);
            });
        }
    }


}