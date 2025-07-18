package com.example.loracafe.dashboard.controller;

import com.example.loracafe.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /** 
    @param model
    @return
    */
    @GetMapping
    public String getDashboardPage(Model model) {
        Map<String, Object> dashboardData = dashboardService.getDashboardData();
        
        model.addAllAttributes(dashboardData);
        
        model.addAttribute("page", "dashboard");
        
        return "Dashboard/index";
    }

    @GetMapping("/products")
    public String getProductsPage(Model model) {
        model.addAttribute("page", "products");
        return "Dashboard/index";
    }

    @GetMapping("/orders")
    public String getOrdersPage(Model model) {
        model.addAttribute("page", "orders");
        return "Dashboard/index";
    }

    @GetMapping("/customers")
    public String getCustomersPage(Model model) {
        model.addAttribute("page", "customers");
        return "Dashboard/index";
    }
    
    @GetMapping("/messages")
    public String getMessagesPage(Model model) {
        model.addAttribute("page", "messages");
        return "Dashboard/index";
    }

    @GetMapping("/users")
    public String getUsersPage(Model model) {
        model.addAttribute("page", "users");
        return "Dashboard/index";
    }

    @GetMapping("/analytics")
    public String getAnalyticsPage(Model model) {
        model.addAttribute("page", "analytics");
        return "Dashboard/index";
    }

    @GetMapping("/reports")
    public String getReportsPage(Model model) {
        model.addAttribute("page", "reports");
        return "Dashboard/index";
    }

    @GetMapping("/settings")
    public String getSettingsPage(Model model) {
        model.addAttribute("page", "settings");
        return "Dashboard/index";
    }
}