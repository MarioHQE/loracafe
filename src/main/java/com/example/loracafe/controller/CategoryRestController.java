package com.example.loracafe.controller;

import com.example.loracafe.entity.Categoria;
import com.example.loracafe.service.CategoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryRestController {

    @Autowired
    private CategoriaService categoriaService;

    /**
     * Obtiene todas las categorías activas.
     * Responde a GET /api/categories
     * 
     * @return Una lista de categorías activas y estado 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> getAllActiveCategorias() {
        List<Categoria> categorias = categoriaService.getAllCategoriasActivas();
        return ResponseEntity.ok(categorias);
    }
}