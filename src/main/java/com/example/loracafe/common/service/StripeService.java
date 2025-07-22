package com.example.loracafe.common.service;

import com.example.loracafe.common.entity.Pedido;
import com.example.loracafe.common.entity.DetallePedido;
import com.example.loracafe.common.entity.Producto;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {
    private static final String STRIPE_SECRET_KEY = "sk_test_51RRpwwRS5ApzbFdePxJPtFPIU5SoWXi6a9r3BfW92TNd6cPSTMf3n3BfnazI9t0KBir2VbNPYLifXVjSVUmPrlPX001PqO7jS7";

    public String procesarPago(Pedido pedido) throws Exception {
        Stripe.apiKey = STRIPE_SECRET_KEY;
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                Producto producto = detalle.getProducto();
                String nombre = producto.getNombre();
                String descripcion = (producto.getDescripcion() != null && !producto.getDescripcion().trim().isEmpty())
                        ? producto.getDescripcion()
                        : "Producto de LoraCafe";
                long precioUnitario = detalle.getPrecioUnitario().multiply(new java.math.BigDecimal(100)).longValue();
                lineItems.add(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity((long) detalle.getCantidad())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("pen")
                                                .setUnitAmount(precioUnitario)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(nombre)
                                                                .setDescription(descripcion)
                                                                .build())
                                                .build())
                                .build());
            }
        } else {
            // Fallback: un solo item con el total
            lineItems.add(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("pen")
                                            .setUnitAmount(pedido.getTotal().multiply(new java.math.BigDecimal(100))
                                                    .longValue())
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName("Pedido LoraCafe #" + pedido.getId())
                                                            .setDescription("Pedido en LoraCafe")
                                                            .build())
                                            .build())
                            .build());
        }
        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8090/Cliente/pago?success=true&id=" + pedido.getId())
                .setCancelUrl("http://localhost:8090/Cliente/pago?canceled=true&id=" + pedido.getId());
        for (SessionCreateParams.LineItem item : lineItems) {
            paramsBuilder.addLineItem(item);
        }
        // Agregar metadata correctamente
        Map<String, String> metadata = new HashMap<>();
        metadata.put("pedido_id", String.valueOf(pedido.getId()));
        paramsBuilder.putAllMetadata(metadata);
        Session session = Session.create(paramsBuilder.build());
        return session.getUrl();
    }
}