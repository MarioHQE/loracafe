package com.example.loracafe.client.service;

import com.example.loracafe.common.dto.ProductoClienteDto;
import com.example.loracafe.common.entity.Categoria;
import com.example.loracafe.common.entity.Producto; // Importar Producto
import com.example.loracafe.common.repository.CategoriaRepository;
import com.example.loracafe.common.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Importar Optional
import java.util.stream.Collectors;

@Service
public class ClientProductService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Obtiene todos los productos disponibles como una lista de DTOs.
     */
    public List<ProductoClienteDto> getAvailableProducts() {
        return productoRepository.findByDisponibleTrue()
                .stream()
                .map(ProductoClienteDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos disponibles de una categoría específica como una lista de DTOs.
     */
    public List<ProductoClienteDto> getAvailableProductsByCategory(Integer categoriaId) {
        return productoRepository.findByDisponibleTrueAndCategoriaId(categoriaId)
                .stream()
                .map(ProductoClienteDto::new)
                .collect(Collectors.toList());
    }
    
    /**
     * ¡¡MÉTODO CORREGIDO Y AÑADIDO!!
     * Obtiene una sola ENTIDAD Producto por su ID, solo si está disponible.
     * Se necesita la entidad completa para poder añadirla al carrito en el frontend.
     * @param id El ID del producto.
     * @return Un Optional que contiene la entidad Producto si se encuentra y está disponible.
     */
    public Optional<Producto> getAvailableProductById(Integer id) {
        return productoRepository.findByIdAndDisponibleTrue(id);
    }

    /**
     * Obtiene todas las categorías que están marcadas como activas.
     */
    public List<Categoria> getActiveCategories() {
        return categoriaRepository.findByActivaTrue();
    }
}