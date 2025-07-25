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
import com.example.loracafe.common.service.StripeService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.extern.slf4j.Slf4j;

import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import com.example.loracafe.common.service.PedidoService;
import com.example.loracafe.common.entity.Pedido;
import com.example.loracafe.common.entity.DetallePedido;
import com.example.loracafe.common.entity.Producto;
import com.example.loracafe.common.repository.ProductoRepository;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@Slf4j
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
    @Autowired
    private StripeService stripeService;

    private String stripeWebhookSecret = "whsec_0413b21f46b91831209ef4ada5ff08fd7428b314238748ae2a4819d5dad629a4";
    @Autowired
    private ProductoRepository productoRepository;

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
        // Log de depuración para ver los datos recibidos
        System.out.println("--- Datos recibidos en MercadoPagoRequestDto ---");
        System.out.println("pedidoId: " + pagoDto.getPedidoId());
        System.out.println("token: " + pagoDto.getToken());
        System.out.println("paymentMethodId: " + pagoDto.getPaymentMethodId());
        System.out.println("issuerId: " + pagoDto.getIssuerId());
        System.out.println("email: " + pagoDto.getEmail());
        System.out.println("installments: " + pagoDto.getInstallments());
        System.out.println("identificationType: " + pagoDto.getIdentificationType());
        System.out.println("identificationNumber: " + pagoDto.getIdentificationNumber());
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

    @PostMapping("/pagos/stripe")
    public ResponseEntity<?> crearPagoStripe(@RequestBody Map<String, Object> body, Authentication authentication) {
        Integer pedidoId = null;
        if (body.get("pedidoId") instanceof Integer) {
            pedidoId = (Integer) body.get("pedidoId");
        } else if (body.get("pedidoId") instanceof String) {
            pedidoId = Integer.valueOf((String) body.get("pedidoId"));
        }
        if (pedidoId == null) {
            return ResponseEntity.badRequest().body("Falta el ID del pedido");
        }
        Pedido pedido = pedidoService.getPedidoById(pedidoId).orElse(null);
        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido no encontrado");
        }
        try {
            String url = stripeService.procesarPago(pedido);
            Map<String, String> resp = new HashMap<>();
            resp.put("url", url);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear sesión de pago Stripe: " + e.getMessage());
        }
    }

    @PostMapping("/pagos/stripe/webhook")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null && session.getMetadata() != null) {
                    log.info("Metadata recibido en webhook: " + session.getMetadata());
                    if (session.getMetadata().containsKey("pedido_id")) {
                        log.info("ID de pedido recibido en webhook: " + session.getMetadata().get("pedido_id"));
                    }
                }
                if (session != null && session.getMetadata() != null
                        && session.getMetadata().containsKey("pedido_id")) {
                    Integer pedidoId = Integer.valueOf(session.getMetadata().get("pedido_id"));
                    Optional<Pedido> pedidoOpt = pedidoService.getPedidoById(pedidoId);
                    if (pedidoOpt.isPresent()) {
                        Pedido pedido = pedidoOpt.get();
                        pedido.setEstado(Pedido.EstadoPedido.PAGADO);
                        // Disminuir stock de productos
                        if (pedido.getDetalles() != null) {
                            for (DetallePedido detalle : pedido.getDetalles()) {
                                Producto producto = detalle.getProducto();
                                int nuevoStock = producto.getStock() - detalle.getCantidad();
                                producto.setStock(nuevoStock);
                                productoRepository.save(producto);
                            }
                        }
                        pedidoService.savePedido(pedido);
                    }
                }
            }
            return ResponseEntity.ok("Webhook procesado");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Error procesando webhook: " + e.getMessage());
        }
    }
}