package com.example.loracafe.service;

import com.example.loracafe.entity.Pedido;
import com.example.loracafe.entity.Usuario;
import com.example.loracafe.repository.DetallePedidoRepository;
import com.example.loracafe.repository.PedidoRepository;
import com.example.loracafe.repository.ProductoRepository;
import com.example.loracafe.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    /**
     * @return
     */
    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        data.put("pedidosHoy", pedidoRepository.countByFechaPedidoAfter(startOfToday));
        data.put("totalProductos", productoRepository.count());
        data.put("nuevosClientes",
                usuarioRepository.countByRolAndFechaRegistroAfter(Usuario.Rol.CLIENTE, startOfMonth));
        List<Pedido> pedidosRecientes = pedidoRepository.findTop5ByOrderByFechaPedidoDesc();
        data.put("pedidosRecientes", pedidosRecientes);

        return data;
    }

    /**
     * @return
     */
    public Map<String, Object> getChartData() {
        Map<String, Object> chartData = new HashMap<>();

        List<Map<String, Object>> salesByCategoryData = detallePedidoRepository.findSalesByCategory();
        chartData.put("salesByCategory", processChartData(salesByCategoryData, "category", "totalSold"));

        LocalDateTime last12Months = LocalDateTime.now().minusYears(1);
        List<Map<String, Object>> monthlyRevenueData = pedidoRepository.findMonthlyRevenue(last12Months);
        chartData.put("monthlyRevenue", processMonthlyRevenueData(monthlyRevenueData));

        return chartData;
    }

    /**
     * @return
     */
    public Map<String, Object> getAnalyticsData() {
        Map<String, Object> analyticsData = new HashMap<>();
        Pageable top5 = PageRequest.of(0, 5);
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        List<Map<String, Object>> topProductsData = detallePedidoRepository.findTopSoldProducts(top5);
        analyticsData.put("topProducts", processChartData(topProductsData, "producto", "totalVendido"));

        List<Map<String, Object>> revenueByHourData = pedidoRepository.findRevenueByHour(todayStart);
        analyticsData.put("revenueByHour", processHourlyRevenueData(revenueByHourData));

        analyticsData.put("topCustomers", pedidoRepository.findTopActiveCustomers(top5));

        List<Map<String, Object>> revenueByCategory = detallePedidoRepository.findRevenueByCategory();
        double totalRevenue = revenueByCategory.stream()
                .mapToDouble(item -> ((BigDecimal) item.get("totalVentas")).doubleValue())
                .sum();

        for (Map<String, Object> item : revenueByCategory) {
            double categoryRevenue = ((BigDecimal) item.get("totalVentas")).doubleValue();
            item.put("porcentaje", (totalRevenue > 0) ? (categoryRevenue / totalRevenue) * 100 : 0);
        }
        analyticsData.put("categorySummary", revenueByCategory);

        return analyticsData;
    }

    /**
     * @param dataList
     * @param labelKey
     * @param dataKey
     * @return
     */
    private Map<String, Object> processChartData(List<Map<String, Object>> dataList, String labelKey, String dataKey) {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Number> data = new ArrayList<>();

        for (Map<String, Object> item : dataList) {
            if (item.get(labelKey) != null && item.get(dataKey) != null) {
                labels.add(String.valueOf(item.get(labelKey)));
                data.add((Number) item.get(dataKey));
            }
        }
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }

    private Map<String, Object> processMonthlyRevenueData(List<Map<String, Object>> monthlyRevenueData) {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        Locale spanishLocale = Locale.forLanguageTag("es-ES");

        for (Map<String, Object> item : monthlyRevenueData) {
            Integer monthNumber = (Integer) item.get("month");
            if (monthNumber != null) {
                String monthName = java.time.Month.of(monthNumber).getDisplayName(TextStyle.SHORT, spanishLocale);
                labels.add(monthName);
                data.add(((Number) item.get("revenue")).doubleValue());
            }
        }
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }

    private Map<String, Object> processHourlyRevenueData(List<Map<String, Object>> revenueByHourData) {
        Map<String, Object> result = new HashMap<>();
        Map<Integer, Double> hourlyMap = new TreeMap<>();
        for (int i = 8; i <= 17; i++) {
            hourlyMap.put(i, 0.0);
        }
        for (Map<String, Object> item : revenueByHourData) {
            Integer hour = ((Number) item.get("hour")).intValue();
            Double revenue = ((Number) item.get("revenue")).doubleValue();
            hourlyMap.put(hour, revenue);
        }
        result.put("labels",
                hourlyMap.keySet().stream().map(h -> String.format("%02d:00", h)).collect(Collectors.toList()));
        result.put("data", new ArrayList<>(hourlyMap.values()));
        return result;
    }
}