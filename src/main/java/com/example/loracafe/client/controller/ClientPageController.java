package com.example.loracafe.client.controller;

import com.example.loracafe.client.service.ClientProductService;
import com.example.loracafe.common.entity.Categoria;
import com.example.loracafe.common.service.UsuarioService; // Importar UsuarioService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication; // Importar Authentication
import org.springframework.security.core.context.SecurityContextHolder; // Importar SecurityContextHolder
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ClientPageController {

    @Autowired
    private ClientProductService clientProductService;

    @Autowired
    private UsuarioService usuarioService;

    private void addUserDetailsToModel(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Verificamos si hay un usuario autenticado y no es el "usuario anónimo"
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            usuarioService.getUsuarioByEmail(email).ifPresent(usuario -> {
                model.addAttribute("usuarioLogueado", usuario);
            });
        }
    }

    @GetMapping("/")
    public String redirectToHome() {
        return "redirect:/inicio";
    }

    @GetMapping("/inicio")
    public String showHomePage(Model model) {
        addUserDetailsToModel(model);
        return "Cliente/cliente-inicio";
    }

    @GetMapping("/carta")
    public String showCartaPage(Model model) {
        addUserDetailsToModel(model);
        List<Categoria> categorias = clientProductService.getActiveCategories();
        model.addAttribute("categorias", categorias);
        return "Cliente/carta";
    }

    @GetMapping("/sobrenosotros")
    public String showSobreNosotrosPage(Model model) {
        addUserDetailsToModel(model);
        return "Cliente/sobrenosotros";
    }

    @GetMapping("/carrito")
    public String showCarritoPage(Model model) {
        addUserDetailsToModel(model);
        return "Cliente/carrito";
    }

    // Dentro de ClientPageController.java

    // Ahora este método servirá la página unificada
    @GetMapping("/mi-cuenta")
    public String showMyAccountPage(Model model) {
        addUserDetailsToModel(model);
        return "Cliente/mi-cuenta"; // Apunta al nuevo archivo HTML
    }

    @GetMapping("/acceso-denegado")
    public String showAccessDeniedPage(Model model) {
        // Añadimos los detalles del usuario para que el navbar se muestre correctamente
        addUserDetailsToModel(model);
        return "Cliente/403";
    }

    @GetMapping("/Cliente/pago")
    public String showPagoPage(Model model) {
        addUserDetailsToModel(model);
        return "Cliente/pago";
    }

}