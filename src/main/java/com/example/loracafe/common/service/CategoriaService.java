package com.example.loracafe.common.service;

import com.example.loracafe.common.entity.Categoria;
import com.example.loracafe.common.repository.CategoriaRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public List<Categoria> getAllCategoriasActivas() {
        return categoriaRepository.findByActiva(true);
    }

    public Optional<Categoria> getCategoriaById(Integer id) {
        return categoriaRepository.findById(id);
    }

    @Transactional
    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public void deleteCategoria(Integer id) {
        categoriaRepository.deleteById(id);
    }

    @Transactional
    public Categoria updateCategoria(Integer id, Categoria categoria) {
        Categoria categoriaExistente = getCategoriaById(id).orElse(null);
        if (categoriaExistente != null) {
            categoriaExistente.setNombre(categoria.getNombre());
            categoriaExistente.setDescripcion(categoria.getDescripcion());
            categoriaExistente.setImagenUrl(categoria.getImagenUrl());
            categoriaExistente.setActiva(categoria.isActiva()); // Ahora también actualiza 'activa'
            return categoriaRepository.save(categoriaExistente);
        }
        return null;
    }
}