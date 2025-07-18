package com.example.loracafe.dashboard.controller;


import com.example.loracafe.dashboard.entity.Producto;
import com.example.loracafe.dashboard.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/products")
public class ProductRestController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Integer id) {
        Optional<Producto> productoOptional = productoService.getProductoById(id);
        if (productoOptional.isPresent()) {
            return ResponseEntity.ok(productoOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     
     @param term
     @return
     */
    @GetMapping("/search")
    public ResponseEntity<List<Producto>> searchProductos(@RequestParam("term") String term) {
        List<Producto> productos = productoService.searchProductos(term);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.saveProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    /**
     @param id
     @param productoDetails
     @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Integer id, @RequestBody Producto productoDetails) {
        Optional<Producto> productoOptional = productoService.getProductoById(id);

        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Producto productoExistente = productoOptional.get();
        productoExistente.setNombre(productoDetails.getNombre());
        productoExistente.setDescripcion(productoDetails.getDescripcion());
        productoExistente.setPrecio(productoDetails.getPrecio());
        productoExistente.setStock(productoDetails.getStock());
        productoExistente.setDisponible(productoDetails.isDisponible());
        productoExistente.setCategoria(productoDetails.getCategoria());
        
        productoExistente.setImagenUrl(productoDetails.getImagenUrl());
        
        Producto productoActualizado = productoService.saveProducto(productoExistente);
        return ResponseEntity.ok(productoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        if (!productoService.getProductoById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}