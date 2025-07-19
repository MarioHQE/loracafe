package com.example.loracafe.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.loracafe.entity.DetallePedido;

import java.util.List;
import java.util.Map;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {

       /**
        * @return
        */
       @Query("SELECT new map(d.producto.categoria.nombre as category, SUM(d.cantidad) as totalSold) " +
                     "FROM DetallePedido d " +
                     "WHERE d.producto.categoria.nombre IS NOT NULL " +
                     "GROUP BY d.producto.categoria.nombre " +
                     "ORDER BY totalSold DESC")
       List<Map<String, Object>> findSalesByCategory();

       /**
        * 
        * @return
        */
       @Query("SELECT new map(d.producto.categoria.nombre as categoria, SUM(d.subtotal) as totalVentas) " +
                     "FROM DetallePedido d " +
                     "JOIN d.pedido p " +
                     "WHERE p.estado = 'COMPLETADO' AND d.producto.categoria.nombre IS NOT NULL " +
                     "GROUP BY d.producto.categoria.nombre " +
                     "ORDER BY totalVentas DESC")
       List<Map<String, Object>> findRevenueByCategory();

       /**
        * @param pageable
        * @return
        */
       @Query("SELECT new map(d.producto.nombre as producto, SUM(d.cantidad) as totalVendido) " +
                     "FROM DetallePedido d " +
                     "GROUP BY d.producto.nombre " +
                     "ORDER BY totalVendido DESC")
       List<Map<String, Object>> findTopSoldProducts(Pageable pageable);
}