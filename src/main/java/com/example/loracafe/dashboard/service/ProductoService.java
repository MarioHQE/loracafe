package com.example.loracafe.dashboard.service;

import com.example.loracafe.common.entity.Producto;
import com.example.loracafe.common.dto.ProductoDashboardDto; 
import com.example.loracafe.common.repository.ProductoRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Obtiene una lista de las ENTIDADES Producto completas.
     * Usado internamente por otros servicios, como el ReportService.
     * @return Lista de todas las entidades Producto.
     */
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    /**
      @return 
     */
    public List<ProductoDashboardDto> getAllProductosDto() {
        return productoRepository.findAll()
                .stream()
                .map(ProductoDashboardDto::new)
                .collect(Collectors.toList());
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