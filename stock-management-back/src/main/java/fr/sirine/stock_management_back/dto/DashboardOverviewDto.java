package fr.sirine.stock_management_back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DashboardOverviewDto {
    private long totalProducts;
    private long lowStockProducts;
    private List<StockMovementDto> recentMovements;
    private List<ProductQuantityDto> productQuantities;
    private Integer groupId;
}
