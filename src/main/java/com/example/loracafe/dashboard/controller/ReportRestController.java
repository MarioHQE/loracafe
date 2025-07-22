package com.example.loracafe.dashboard.controller;

import com.example.loracafe.dashboard.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/dashboard/reports")
public class ReportRestController {

    @Autowired
    private ReportService reportService;

    /**
    
      @return
     */
    @GetMapping(value = "/products", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> generateProductsReport() {
        
        ByteArrayInputStream pdfInputStream = reportService.generateProductsPdfReport();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=reporte-productos.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfInputStream));
    }
    // ======================================================
    //     NUEVO ENDPOINT PARA REPORTE DE VENTAS
    // ======================================================
    @GetMapping(value = "/sales", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getSalesReport() {
        ByteArrayInputStream pdf = reportService.generateSalesPdfReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=reporte-ventas.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    // ======================================================
    //     NUEVO ENDPOINT PARA REPORTE DE CLIENTES
    // ======================================================
    @GetMapping(value = "/customers", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getCustomersReport() {
        ByteArrayInputStream pdf = reportService.generateCustomersPdfReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=reporte-clientes.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    // ======================================================
//     NUEVO ENDPOINT PARA REPORTE GENERAL
// ======================================================
@GetMapping(value = "/general", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<InputStreamResource> getGeneralReport() {
    ByteArrayInputStream pdf = reportService.generateGeneralDashboardReport();

    HttpHeaders headers = new HttpHeaders();
    // Le damos un nombre al archivo con la fecha actual
    String filename = "reporte_general_" + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE) + ".pdf";
    headers.add("Content-Disposition", "inline; filename=" + filename);

    return ResponseEntity.ok()
            .headers(headers)
            .contentType(MediaType.APPLICATION_PDF)
            .body(new InputStreamResource(pdf));
}
}