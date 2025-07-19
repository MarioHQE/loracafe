package com.example.loracafe.service;

import com.example.loracafe.entity.Producto;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

        @Autowired
        private ProductoService productoService;

        /**
         * @return
         */
        public ByteArrayInputStream generateProductsPdfReport() {
                List<Producto> productos = productoService.getAllProductos();

                ByteArrayOutputStream out = new ByteArrayOutputStream();

                try {
                        PdfWriter writer = new PdfWriter(out);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf);

                        document.add(new Paragraph("Reporte de Inventario de Productos")
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setFontSize(20)
                                        .setBold());

                        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        document.add(new Paragraph("Generado el: " + fecha)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setFontSize(12));

                        document.add(new Paragraph("\n"));

                        float[] columnWidths = { 1, 4, 3, 2, 2 };
                        Table table = new Table(UnitValue.createPercentArray(columnWidths));
                        table.setWidth(UnitValue.createPercentValue(100));

                        table.addHeaderCell(
                                        new Cell().add(new Paragraph("ID"))
                                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
                        table.addHeaderCell(new Cell().add(new Paragraph("Nombre del Producto"))
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
                        table.addHeaderCell(
                                        new Cell().add(new Paragraph("Categoría"))
                                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
                        table.addHeaderCell(
                                        new Cell().add(new Paragraph("Precio"))
                                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
                        table.addHeaderCell(
                                        new Cell().add(new Paragraph("Stock"))
                                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());

                        for (Producto producto : productos) {
                                table.addCell(String.valueOf(producto.getId()));
                                table.addCell(producto.getNombre());
                                table.addCell(producto.getCategoria() != null ? producto.getCategoria().getNombre()
                                                : "N/A");
                                table.addCell("S/ " + producto.getPrecio().toString());
                                table.addCell(String.valueOf(producto.getStock()));
                        }

                        document.add(table);

                        document.close();

                } catch (Exception e) {
                        e.printStackTrace();
                }

                return new ByteArrayInputStream(out.toByteArray());
        }
}