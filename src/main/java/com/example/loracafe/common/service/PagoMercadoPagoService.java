package com.example.loracafe.common.service;

import com.example.loracafe.common.dto.MercadoPagoRequestDto;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

@Service
public class PagoMercadoPagoService {
        public Payment procesarPago(MercadoPagoRequestDto dto, float monto)
                        throws MPException, MPApiException {

                // Validar datos del payer
                if (dto.getEmail() == null || dto.getEmail().trim().isEmpty() ||
                                dto.getIdentificationType() == null || dto.getIdentificationType().trim().isEmpty() ||
                                dto.getIdentificationNumber() == null
                                || dto.getIdentificationNumber().trim().isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Faltan datos del titular para procesar el pago (email o documento)");
                }

                // Redondear a dos decimales y validar
                BigDecimal montoValido = BigDecimal.valueOf(monto).setScale(2, RoundingMode.HALF_UP);
                if (montoValido.compareTo(BigDecimal.valueOf(1.00)) < 0) {
                        throw new IllegalArgumentException("El monto del pedido debe ser mayor o igual a 1.00");
                }
                System.out.println("Monto enviado a Mercado Pago: " + montoValido);

                MercadoPagoConfig.setAccessToken(
                                "APP_USR-1210393969500054-072204-0ccbf88e4f7a05b3e1db0e622d05f3d1-1898907784");
                PaymentClient client = new PaymentClient();
                IdentificationRequest identification = IdentificationRequest.builder()
                                .type(dto.getIdentificationType())
                                .number(dto.getIdentificationNumber())
                                .build();
                PaymentPayerRequest payer = PaymentPayerRequest.builder()
                                .email(dto.getEmail())
                                .identification(identification)
                                .build();
                PaymentCreateRequest request = PaymentCreateRequest.builder()
                                .transactionAmount(montoValido)
                                .token(dto.getToken())
                                .description("Pago pedido #" + dto.getPedidoId())
                                .installments(dto.getInstallments())
                                .paymentMethodId(dto.getPaymentMethodId())
                                .issuerId(dto.getIssuerId() != null ? dto.getIssuerId() : null)
                                .payer(payer)
                                .build();
                return client.create(request);
        }
}