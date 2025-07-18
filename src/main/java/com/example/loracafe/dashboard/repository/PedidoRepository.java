package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Pedido;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer>, JpaSpecificationExecutor<Pedido> {

    long countByFechaPedidoAfter(LocalDateTime fecha);

    
    List<Pedido> findTop5ByOrderByFechaPedidoDesc();

    
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Integer usuarioId);

    /**
  
     @param startDate
      @return 
     */
    @Query("SELECT new map(FUNCTION('YEAR', p.fechaPedido) as year, FUNCTION('MONTH', p.fechaPedido) as month, SUM(p.total) as revenue) " +
           "FROM Pedido p " +
           "WHERE p.estado = 'COMPLETADO' AND p.fechaPedido > :startDate " +
           "GROUP BY FUNCTION('YEAR', p.fechaPedido), FUNCTION('MONTH', p.fechaPedido) " +
           "ORDER BY year, month")
    List<Map<String, Object>> findMonthlyRevenue(LocalDateTime startDate);

    /**
      @param startDate
      @return
     */
    @Query("SELECT new map(FUNCTION('HOUR', p.fechaPedido) as hour, SUM(p.total) as revenue) " +
           "FROM Pedido p " +
           "WHERE p.estado = 'COMPLETADO' AND p.fechaPedido >= :startDate " +
           "GROUP BY FUNCTION('HOUR', p.fechaPedido) " +
           "ORDER BY hour")
    List<Map<String, Object>> findRevenueByHour(LocalDateTime startDate);

    /**
      @param pageable
      @return 
     */
    @Query("SELECT new map(p.usuario.nombre as nombre, p.usuario.apellido as apellido, COUNT(p) as totalPedidos, SUM(p.total) as totalGastado) " +
           "FROM Pedido p " +
           "WHERE p.estado = 'COMPLETADO' AND p.usuario IS NOT NULL " +
           "GROUP BY p.usuario.id, p.usuario.nombre, p.usuario.apellido " +
           "ORDER BY totalPedidos DESC, totalGastado DESC")
    List<Map<String, Object>> findTopActiveCustomers(Pageable pageable);
}