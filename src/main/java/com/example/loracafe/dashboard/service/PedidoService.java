package com.example.loracafe.dashboard.service;

import com.example.loracafe.dashboard.entity.Pedido;
import com.example.loracafe.dashboard.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    
    /**
      @param spec 
      @param pageable
      @return 
     */
    public Page<Pedido> getAllPedidos(Specification<Pedido> spec, Pageable pageable) {
        return pedidoRepository.findAll(spec, pageable);
    }

    /**
      @return 
     */
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    /**
      @param id 
      @return 
     */
    public Optional<Pedido> getPedidoById(Integer id) {
        return pedidoRepository.findById(id);
    }
    
    /**
      @param pedido 
      @return 
     */
    public Pedido savePedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
}