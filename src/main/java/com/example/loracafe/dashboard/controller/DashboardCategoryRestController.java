package com.example.loracafe.dashboard.controller;

import com.example.loracafe.common.entity.Categoria;
import com.example.loracafe.common.service.CategoriaService; // Asumiendo que CategoriaService está en common
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para proveer las categorías al Dashboard.
 * Esta API está protegida y solo es accesible para usuarios administradores.
 */
@RestController
@RequestMapping("/api/dashboard/categories") // <-- La URL que el JavaScript está buscando
public class DashboardCategoryRestController {

    @Autowired
    private CategoriaService categoriaService;

    /**
     * Devuelve una lista de TODAS las categorías (activas e inactivas)
     * para que el administrador pueda gestionarlas.
     * @return Una lista de todas las categorías en la base de datos.
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategoriesForDashboard() {
        List<Categoria> categorias = categoriaService.getAllCategorias();
        return ResponseEntity.ok(categorias);
    }
}