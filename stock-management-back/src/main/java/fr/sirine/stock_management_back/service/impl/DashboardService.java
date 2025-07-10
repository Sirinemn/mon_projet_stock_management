package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.dto.*;
import fr.sirine.stock_management_back.entities.StockMovement;
import fr.sirine.stock_management_back.service.IProductService;
import fr.sirine.stock_management_back.service.IStockMovementService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final IProductService productService;
    private final IStockMovementService stockMovementService;

    public DashboardService(IProductService productService, IStockMovementService stockMovementService) {
        this.productService = productService;
        this.stockMovementService = stockMovementService;
    }

    public DashboardOverviewDto getDashboardOverview(Integer groupId) {
        long totalProducts = productService.countByGroupId(groupId);
        long lowStockProducts = productService.findAllByGroupId(groupId)
                .stream()
                .filter(product -> product.getQuantity() <= product.getThreshold())
                .count();

        List<StockMovementDto> recentMovements = stockMovementService.findTop10ByGroupIdOrderByDateDesc(groupId);

        // Pour le pie chart : Stock Normal vs Stock Faible
        List<ProductQuantityDto> stockStatusChart = getStockStatusChart(totalProducts, lowStockProducts);

        return DashboardOverviewDto.builder()
                .totalProducts(totalProducts)
                .lowStockProducts(lowStockProducts)
                .recentMovements(recentMovements)
                .productQuantities(stockStatusChart)  // Renommé pour plus de clarté
                .groupId(groupId)
                .build();
    }

    private List<ProductQuantityDto> getStockStatusChart(long totalProducts, long lowStockProducts) {
        List<ProductQuantityDto> chartData = new ArrayList<>();

        long normalStockProducts = totalProducts - lowStockProducts;

        // Ajouter les données pour le pie chart
        if (normalStockProducts > 0) {
            chartData.add(new ProductQuantityDto("Stock Normal", (int) normalStockProducts));
        }

        if (lowStockProducts > 0) {
            chartData.add(new ProductQuantityDto("Stock Faible", (int) lowStockProducts));
        }

        // Si aucun produit, ajouter une entrée pour éviter un graphique vide
        if (totalProducts == 0) {
            chartData.add(new ProductQuantityDto("Aucun Produit", 0));
        }

        return chartData;
    }

    public List<ProductQuantityDto> getProductQuantities(Integer groupId) {
        return productService.findAllByGroupId(groupId).stream()
                .map(p -> new ProductQuantityDto(p.getName(), p.getQuantity()))
                .collect(Collectors.toList());
    }
    public StockStatsDto getStockStats(Integer groupId) {
        List<ProductDto> products = productService.findAllByGroupId(groupId);

        long totalProducts = products.size();
        long lowStockProducts = products.stream()
                .filter(product -> product.getQuantity() <= product.getThreshold())
                .count();
        long outOfStockProducts = products.stream()
                .filter(product -> product.getQuantity() == 0)
                .count();

        int totalQuantity = products.stream()
                .mapToInt(ProductDto::getQuantity)
                .sum();

        return StockStatsDto.builder()
                .totalProducts(totalProducts)
                .lowStockProducts(lowStockProducts)
                .outOfStockProducts(outOfStockProducts)
                .normalStockProducts(totalProducts - lowStockProducts)
                .totalQuantity(totalQuantity)
                .build();
    }
    public List<ProductQuantityDto> getStockCategoryChart(Integer groupId) {
        List<ProductDto> products = productService.findAllByGroupId(groupId);

        List<ProductQuantityDto> chartData = new ArrayList<>();

        long outOfStock = products.stream()
                .filter(product -> product.getQuantity() == 0)
                .count();

        long lowStock = products.stream()
                .filter(product -> product.getQuantity() > 0 && product.getQuantity() <= product.getThreshold())
                .count();

        long normalStock = products.stream()
                .filter(product -> product.getQuantity() > product.getThreshold())
                .count();

        if (outOfStock > 0) {
            chartData.add(new ProductQuantityDto("Rupture de Stock", (int) outOfStock));
        }
        if (lowStock > 0) {
            chartData.add(new ProductQuantityDto("Stock Faible", (int) lowStock));
        }
        if (normalStock > 0) {
            chartData.add(new ProductQuantityDto("Stock Normal", (int) normalStock));
        }

        if (chartData.isEmpty()) {
            chartData.add(new ProductQuantityDto("Aucun Produit", 0));
        }

        return chartData;
    }

}

