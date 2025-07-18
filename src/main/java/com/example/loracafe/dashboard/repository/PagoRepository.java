package com.example.loracafe.dashboard.repository;

import com.example.loracafe.dashboard.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
}