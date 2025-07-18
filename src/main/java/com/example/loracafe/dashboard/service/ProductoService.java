package com.example.loracafe.dashboard.service;

import com.example.loracafe.dashboard.entity.Producto;
import com.example.loracafe.dashboard.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    /**
      @return 
     */
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    /**
      @param id 
      @return
     */
    public Optional<Producto> getProductoById(Integer id) {
        return productoRepository.findById(id);
    }

    /**
      @param producto 
      @return 
     */
    @Transactional
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    /**
      @param id 
     */
    @Transactional
    public void deleteProducto(Integer id) {
        productoRepository.deleteById(id);
    }
    
    /**
      @param searchTerm 
      @return 
     */
    public List<Producto> searchProductos(String searchTerm) {
        return productoRepository.findByNombreContainingIgnoreCase(searchTerm);
    }
}