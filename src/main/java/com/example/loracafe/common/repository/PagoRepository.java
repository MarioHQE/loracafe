package com.example.loracafe.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.loracafe.common.entity.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
}