package com.example.loracafe.client.controller;

import com.example.loracafe.client.service.ClientProductService;
import com.example.loracafe.client.service.ClientPromotionService;
import com.example.loracafe.common.dto.MensajeClienteDto;
import com.example.loracafe.common.dto.PromocionClienteDto;
import com.example.loracafe.common.dto.OrderRequestDto;
import com.example.loracafe.common.dto.PedidoSimpleDto;
import com.example.loracafe.common.dto.ProductoClienteDto;
import com.example.loracafe.common.dto.UserProfileDto;
import com.example.loracafe.common.dto.MercadoPagoRequestDto;
import com.example.loracafe.common.entity.*;
import com.example.loracafe.common.service.MensajeService;
import com.example.loracafe.common.service.PedidoService;
import com.example.loracafe.common.service.UsuarioService;
import com.example.loracafe.common.service.PagoMercadoPagoService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
public class ClientApiController {

    @Autowired
    private ClientProductService clientProductService;
    @Autowired
    private ClientPromotionService clientPromotionService;
    @Autowired
    private MensajeService mensajeService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private PagoMercadoPagoService pagoMercadoPagoService;

    // =================================================================
    // ENDPOINTS PÚBLICOS (PRODUCTOS Y PROMOCIONES)
    // =================================================================

    @GetMapping("/products")
    public ResponseEntity<List<ProductoClienteDto>> getProductsForClient(
            @RequestParam(required = false) Integer categoriaId) {
        List<ProductoClienteDto> productos;
        if (categoriaId != null) {
            productos = clientProductService.getAvailableProductsByCategory(categoriaId);
        } else {
            productos = clientProductService.getAvailableProducts();
        }
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Producto> getProductById(@PathVariable Integer id) {
        return clientProductService.getAvailableProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/promotions/active")
    public ResponseEntity<List<PromocionClienteDto>> getActivePromotions() {
        List<PromocionClienteDto> promociones = clientPromotionService.getActivePromotions();
        return ResponseEntity.ok(promociones);
    }

    // =================================================================
    // ENDPOINTS SEGUROS (REQUIEREN AUTENTICACIÓN)
    // =================================================================

    @PostMapping("/messages")
    public ResponseEntity<Void> submitContactMessage(@RequestBody Mensaje mensaje, Authentication authentication) {
        String userEmail = authentication.getName();
        Usuario usuarioLogueado = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("El usuario autenticado no fue encontrado."));

        mensaje.setUsuario(usuarioLogueado);
        mensaje.setNombre(usuarioLogueado.getNombre() + " " + usuarioLogueado.getApellido());
        mensaje.setEmail(userEmail);

        mensajeService.guardarNuevoMensaje(mensaje);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages/my-messages")
    public ResponseEntity<List<MensajeClienteDto>> getMyMessages(Authentication authentication) {
        String userEmail = authentication.getName();
        return usuarioService.getUsuarioByEmail(userEmail)
                .map(usuario -> {
                    List<Mensaje> mensajes = mensajeService.getMensajesByUsuario(usuario.getId());
                    List<MensajeClienteDto> dtos = mensajes.stream()
                            .map(MensajeClienteDto::new)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/account/profile")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication authentication) {
        String userEmail = authentication.getName();
        return usuarioService.getUsuarioByEmail(userEmail)
                .map(usuario -> {
                    UserProfileDto dto = new UserProfileDto(
                            usuario.getNombre(),
                            usuario.getApellido(),
                            usuario.getEmail(),
                            usuario.getTelefono(),
                            usuario.getDireccion());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/account/profile")
    public ResponseEntity<Void> updateMyProfile(@RequestBody UserProfileDto profileDto, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            usuarioService.updateUserProfile(userEmail, profileDto);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/orders/my-orders")
    public ResponseEntity<List<PedidoSimpleDto>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        return usuarioService.getUsuarioByEmail(userEmail)
                .map(usuario -> {
                    List<Pedido> pedidos = pedidoService.getPedidosByUsuario(usuario.getId());
                    List<PedidoSimpleDto> dtos = pedidos.stream()
                            .map(PedidoSimpleDto::new)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<PedidoSimpleDto> getPedidoById(@PathVariable Integer id, Authentication authentication) {
        Pedido pedido = pedidoService.getPedidoById(id).orElse(null);
        if (pedido == null)
            return ResponseEntity.notFound().build();
        // (Opcional: valida que el pedido pertenezca al usuario autenticado)
        return ResponseEntity.ok(new PedidoSimpleDto(pedido));
    }

    @PostMapping("/orders/create")
    public ResponseEntity<PedidoSimpleDto> createOrder(@RequestBody OrderRequestDto orderRequest,
            Authentication authentication) {
        String userEmail = authentication.getName();
        Usuario usuario = usuarioService.getUsuarioByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado."));

        try {
            Pedido nuevoPedido = pedidoService.crearNuevoPedido(orderRequest, usuario);
            PedidoSimpleDto dto = new PedidoSimpleDto(nuevoPedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto); // Devolvemos 201 Created
        } catch (IllegalStateException e) {
            // Error de negocio (ej. falta de stock)
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (RuntimeException e) {
            // Cualquier otro error inesperado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pagos/mercadopago")
    public ResponseEntity<?> procesarPagoMercadoPago(@RequestBody MercadoPagoRequestDto pagoDto,
            Authentication authentication) throws MPApiException {
        Pedido pedido = pedidoService.getPedidoById(pagoDto.getPedidoId().intValue()).orElse(null);
        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido no encontrado");
        }
        float monto = pedido.getTotal().floatValue();
        System.out.println("Procesando pago para pedido #" + pedido.getId() + " - Monto: " + monto);
        try {
            Payment payment = pagoMercadoPagoService.procesarPago(pagoDto, monto);
            return ResponseEntity.ok(payment);
        } catch (MPApiException e) {
            System.out.println("MPApiException: " + e.getApiResponse().getContent());
            return ResponseEntity.status(500).body("Error MercadoPago: " + e.getApiResponse().getContent());
        } catch (MPException e) {
            return ResponseEntity.status(500).body("Error al procesar el pago: " + e.getMessage());
        }
    }
}