package com.example.loracafe.client.controller;

import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * Muestra la página de login/registro.
     * Añade un objeto Usuario vacío al modelo para el data-binding del formulario de registro.
     */
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "Cliente/login";
    }

    /**
     * Procesa la petición POST del formulario de registro.
     * @param usuario El objeto Usuario poblado con los datos del formulario.
     * @param redirectAttributes Para enviar mensajes (éxito o error) a la siguiente página.
     * @return Una redirección a la página de login.
     */
    @PostMapping("/registro")
    public String processRegistration(@ModelAttribute Usuario usuario, RedirectAttributes redirectAttributes) {
        try {
            usuarioService.registrarNuevoCliente(usuario);
            // Si el registro es exitoso, enviamos un mensaje de éxito.
            redirectAttributes.addFlashAttribute("successMessage", "¡Registro exitoso! Por favor, inicia sesión.");
        } catch (IllegalStateException e) {
            // Si el email ya existe, enviamos un mensaje de error.
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        
        // Redirigimos de vuelta a la página de login.
        return "redirect:/login";
    }
}