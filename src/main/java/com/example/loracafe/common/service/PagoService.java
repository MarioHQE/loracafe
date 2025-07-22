package com.example.loracafe.common.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.loracafe.common.entity.Pago;
import com.example.loracafe.common.repository.PagoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.core.MPRequestOptions;

@Service
public class PagoService {
    @Autowired
    private PagoRepository pagoRepository;

    @Transactional
    public Pago crearPago(Pago pago) {
        Map<String, String> headers = new HashMap<>();
        headers.put("x-idempotency-key", UUID.randomUUID().toString());
        MPRequestOptions options = MPRequestOptions.builder().customHeaders(headers).build();
        MercadoPagoConfig.setAccessToken("APP_USR-1210393969500054-072204-0ccbf88e4f7a05b3e1db0e622d05f3d1-1898907784");
        PaymentClient client = new PaymentClient();
        // PaymentCreateRequest.builder().transactionAmount(B)
        return pagoRepository.save(pago);
    }
}
