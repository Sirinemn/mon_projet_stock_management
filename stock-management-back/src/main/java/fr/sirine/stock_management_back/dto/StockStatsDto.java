package fr.sirine.stock_management_back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockStatsDto {
    private long totalProducts;
    private long lowStockProducts;
    private long outOfStockProducts;
    private long normalStockProducts;
    private int totalQuantity;
}
