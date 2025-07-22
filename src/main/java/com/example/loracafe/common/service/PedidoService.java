package com.example.loracafe.common.service;

import com.example.loracafe.common.dto.OrderRequestDto;
import com.example.loracafe.common.dto.OrderItemDto;
import com.example.loracafe.common.entity.*;
import com.example.loracafe.common.repository.PedidoRepository;
import com.example.loracafe.common.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;
    
    /**
     * Obtiene una lista paginada y filtrada de todos los pedidos (para el Dashboard).
     */
    public Page<Pedido> getAllPedidos(Specification<Pedido> spec, Pageable pageable) {
        return pedidoRepository.findAll(spec, pageable);
    }

    /**
     * Obtiene todos los pedidos sin paginación.
     */
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    /**
     * Busca un pedido por su ID.
     */
    public Optional<Pedido> getPedidoById(Integer id) {
        return pedidoRepository.findById(id);
    }

    /**
     * Busca todos los pedidos asociados a un ID de usuario específico.
     */
    public List<Pedido> getPedidosByUsuario(Integer usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId);
    }
    
    /**
     * Guarda/actualiza un pedido. Usado principalmente por el Dashboard para cambiar estados.
     */
    public Pedido savePedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    /**
     * ¡¡NUEVO MÉTODO!!
     * Crea un nuevo pedido a partir de la solicitud del cliente.
     * Es transaccional: o todo tiene éxito, o nada se guarda.
     * @param orderRequest DTO con los ítems del carrito y datos de envío.
     * @param usuario El usuario autenticado que realiza la compra.
     * @return El Pedido creado y guardado.
     * @throws IllegalStateException si no hay stock suficiente para algún producto.
     */
    @Transactional
    public Pedido crearNuevoPedido(OrderRequestDto orderRequest, Usuario usuario) {
        // 1. Crear la cabecera del pedido
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setUsuario(usuario);
        nuevoPedido.setDireccionEntrega(orderRequest.getDireccionEntrega());
        nuevoPedido.setNotas(orderRequest.getNotas());
        nuevoPedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        nuevoPedido.setFechaPedido(LocalDateTime.now());
        
        BigDecimal totalPedido = BigDecimal.ZERO;
        List<DetallePedido> detalles = new ArrayList<>();

        // 2. Procesar cada ítem del carrito
        for (OrderItemDto itemDto : orderRequest.getItems()) {
            Producto producto = productoRepository.findById(itemDto.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + itemDto.getProductoId()));

            // 2a. Verificar si hay suficiente stock
            if (producto.getStock() < itemDto.getCantidad()) {
                throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // 2b. Crear el objeto DetallePedido
            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(itemDto.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(itemDto.getCantidad()));
            detalle.setSubtotal(subtotal);
            detalle.setPedido(nuevoPedido); // Asociamos el detalle al nuevo pedido
            
            detalles.add(detalle);
            totalPedido = totalPedido.add(subtotal);
        }
        
        // 3. Asignar los detalles y el total al pedido
        nuevoPedido.setTotal(totalPedido);
        nuevoPedido.setDetalles(detalles);

        // 4. Guardar el pedido (JPA/Hibernate guardará los detalles en cascada)
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // 5. Actualizar (restar) el stock de los productos
        for (DetallePedido detalle : pedidoGuardado.getDetalles()) {
            Producto producto = detalle.getProducto();
            int nuevoStock = producto.getStock() - detalle.getCantidad();
            producto.setStock(nuevoStock);
            productoRepository.save(producto); // Guardar el producto con el stock actualizado
        }

        return pedidoGuardado;
    }
}