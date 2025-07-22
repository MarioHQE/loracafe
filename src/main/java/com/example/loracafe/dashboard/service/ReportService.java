package com.example.loracafe.dashboard.service;

import com.example.loracafe.common.entity.Pedido;
import com.example.loracafe.common.entity.Producto;
import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.repository.PedidoRepository;
import com.example.loracafe.common.repository.UsuarioRepository;
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
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ProductoService productoService; 

    @Autowired
    private PedidoRepository pedidoRepository; // Inyectar

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DashboardService dashboardService;

    /**
      @return 
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

            float[] columnWidths = {1, 4, 3, 2, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            table.addHeaderCell(new Cell().add(new Paragraph("ID")).setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
            table.addHeaderCell(new Cell().add(new Paragraph("Nombre del Producto")).setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
            table.addHeaderCell(new Cell().add(new Paragraph("Categoría")).setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
            table.addHeaderCell(new Cell().add(new Paragraph("Precio")).setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());
            table.addHeaderCell(new Cell().add(new Paragraph("Stock")).setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold());

            for (Producto producto : productos) {
                table.addCell(String.valueOf(producto.getId()));
                table.addCell(producto.getNombre());
                table.addCell(producto.getCategoria() != null ? producto.getCategoria().getNombre() : "N/A");
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

    // ======================================================
    //     NUEVO MÉTODO PARA REPORTE DE VENTAS
    // ======================================================
    public ByteArrayInputStream generateSalesPdfReport() {
        // 1. Obtener los datos
        List<Pedido> pedidos = pedidoRepository.findByEstadoOrderByFechaPedidoDesc(Pedido.EstadoPedido.COMPLETADO);
        BigDecimal totalVentas = pedidos.stream()
                                        .map(Pedido::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título y Resumen
            document.add(new Paragraph("Reporte de Ventas").setBold().setFontSize(16));
            document.add(new Paragraph("Fecha de generación: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            document.add(new Paragraph("Total de Pedidos Completados: " + pedidos.size()));
            document.add(new Paragraph("Ingresos Totales: S/ " + totalVentas.setScale(2, RoundingMode.HALF_UP)).setBold());
            document.add(new Paragraph("\n"));

            // Tabla de Pedidos
            float[] columnWidths = {1, 4, 3, 3};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Cabeceras
            table.addHeaderCell("ID Pedido");
            table.addHeaderCell("Cliente");
            table.addHeaderCell("Fecha");
            table.addHeaderCell("Total");

            // Datos
            for (Pedido p : pedidos) {
                table.addCell(String.valueOf(p.getId()));
                table.addCell(p.getUsuario() != null ? p.getUsuario().getNombre() + " " + p.getUsuario().getApellido() : "N/A");
                table.addCell(p.getFechaPedido().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                table.addCell("S/ " + p.getTotal().toString());
            }

            document.add(table);
            document.close();
            
        } catch (Exception e) { e.printStackTrace(); }
        
        return new ByteArrayInputStream(out.toByteArray());
    }


    // ======================================================
    //     NUEVO MÉTODO PARA REPORTE DE CLIENTES
    // ======================================================
    public ByteArrayInputStream generateCustomersPdfReport() {
        // 1. Obtener los datos
        List<Usuario> clientes = usuarioRepository.findByRolOrderByFechaRegistroDesc(Usuario.Rol.CLIENTE);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título
            document.add(new Paragraph("Reporte de Clientes Registrados").setBold().setFontSize(16));
            document.add(new Paragraph("Total de Clientes: " + clientes.size()));
            document.add(new Paragraph("\n"));

            // Tabla de Clientes
            float[] columnWidths = {3, 3, 4, 3};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Cabeceras
            table.addHeaderCell("Nombre");
            table.addHeaderCell("Apellido");
            table.addHeaderCell("Email");
            table.addHeaderCell("Fecha de Registro");
            
            // Datos
            for (Usuario u : clientes) {
                table.addCell(u.getNombre());
                table.addCell(u.getApellido());
                table.addCell(u.getEmail());
                table.addCell(u.getFechaRegistro().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            }
            
            document.add(table);
            document.close();

        } catch (Exception e) { e.printStackTrace(); }
        
        return new ByteArrayInputStream(out.toByteArray());
    }

    // ======================================================
//     NUEVO MÉTODO PARA REPORTE GENERAL
// ======================================================
public ByteArrayInputStream generateGeneralDashboardReport() {
    // 1. Obtener los datos del dashboard
    Map<String, Object> dashboardData = dashboardService.getDashboardData();
    
    // 2. Extraer los datos del mapa
    Long pedidosHoy = (Long) dashboardData.getOrDefault("pedidosHoy", 0L);
    Long totalProductos = (Long) dashboardData.getOrDefault("totalProductos", 0L);
    Long nuevosClientes = (Long) dashboardData.getOrDefault("nuevosClientes", 0L);
    Long mensajesNuevos = (Long) dashboardData.getOrDefault("mensajesNuevos", 0L);
    @SuppressWarnings("unchecked")
    List<Pedido> pedidosRecientes = (List<Pedido>) dashboardData.getOrDefault("pedidosRecientes", new ArrayList<>());

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    
    try {
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Título y fecha
        document.add(new Paragraph("Reporte General del Dashboard")
                .setBold().setFontSize(20).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Generado el: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("\n"));

        // Sección de Resumen de Métricas
        document.add(new Paragraph("Resumen del Día").setBold().setFontSize(16));
        document.add(new Paragraph("• Pedidos Hoy: " + pedidosHoy));
        document.add(new Paragraph("• Mensajes Nuevos: " + mensajesNuevos));
        document.add(new Paragraph("• Nuevos Clientes (este mes): " + nuevosClientes));
        document.add(new Paragraph("• Total de Productos en Inventario: " + totalProductos));
        document.add(new Paragraph("\n\n"));

        // Sección de Pedidos Recientes
        document.add(new Paragraph("Últimos Pedidos Recibidos").setBold().setFontSize(16));
        document.add(new Paragraph("\n"));

        // Tabla de Pedidos Recientes
        float[] columnWidths = {1, 4, 3, 2, 3};
        Table table = new Table(UnitValue.createPercentArray(columnWidths));
        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell("ID");
        table.addHeaderCell("Cliente");
        table.addHeaderCell("Fecha");
        table.addHeaderCell("Total");
        table.addHeaderCell("Estado");

        for (Pedido p : pedidosRecientes) {
            table.addCell(String.valueOf(p.getId()));
            table.addCell(p.getUsuario() != null ? p.getUsuario().getNombre() + " " + p.getUsuario().getApellido() : "N/A");
            table.addCell(p.getFechaPedido().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            table.addCell("S/ " + p.getTotal().toString());
            table.addCell(p.getEstado().name().replace('_', ' '));
        }

        document.add(table);
        document.close();
        
    } catch (Exception e) {
        e.printStackTrace();
    }
    
    return new ByteArrayInputStream(out.toByteArray());
}

}