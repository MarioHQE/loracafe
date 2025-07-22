package com.example.loracafe.dashboard.service;

import com.example.loracafe.common.dto.ClienteDashboardDto;
import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.repository.PedidoRepository;
import com.example.loracafe.common.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerDashboardService {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PedidoRepository pedidoRepository;

    /**
     * Obtiene todos los clientes (usuarios con rol CLIENTE) y enriquece
     * cada uno con su número total de pedidos.
     * @return Una lista de DTOs de clientes para el dashboard.
     */
    public List<ClienteDashboardDto> getClientesConTotalPedidos() {
        // 1. Obtenemos todos los usuarios
        List<Usuario> todosLosUsuarios = usuarioService.getAllUsuarios();

        // 2. Filtramos para quedarnos solo con los clientes
        return todosLosUsuarios.stream()
            .filter(usuario -> usuario.getRol() == Usuario.Rol.CLIENTE)
            .map(cliente -> {
                // 3. Para cada cliente, contamos sus pedidos usando el repositorio
                long totalPedidos = pedidoRepository.countByUsuarioId(cliente.getId());
                // 4. Creamos y devolvemos el DTO con la información combinada
                return new ClienteDashboardDto(cliente, totalPedidos);
            })
            .collect(Collectors.toList());
    }

    // Aquí podrías añadir una función de búsqueda similar si lo necesitas en el futuro
}