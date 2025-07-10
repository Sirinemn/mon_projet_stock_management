package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.dto.DashboardOverviewDto;
import fr.sirine.stock_management_back.dto.ProductQuantityDto;
import fr.sirine.stock_management_back.dto.StockStatsDto;
import fr.sirine.stock_management_back.service.impl.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    @Operation(summary = "Get dashboard overview by group ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid groupId"),
            @ApiResponse(responseCode = "500", description = "Internal error")
    })
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDto> getDashboardOverview(@RequestParam Integer groupId) {
        return ResponseEntity.ok(dashboardService.getDashboardOverview(groupId));
    }
    @Operation(summary = "Get pie chart data by group ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pie chart data retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid groupId"),
            @ApiResponse(responseCode = "500", description = "Internal error")
    })
    @GetMapping("/stock-status")
    public ResponseEntity<List<ProductQuantityDto>> getStockStatusChart(@RequestParam Integer groupId) {
        DashboardOverviewDto overview = dashboardService.getDashboardOverview(groupId);
        return ResponseEntity.ok(overview.getProductQuantities());
    }
    @Operation(summary = "Get detailed stock statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock statistics retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid groupId"),
            @ApiResponse(responseCode = "500", description = "Internal error")
    })
    @GetMapping("/stats")
    public ResponseEntity<StockStatsDto> getStockStats(@RequestParam Integer groupId) {
        return ResponseEntity.ok(dashboardService.getStockStats(groupId));
    }
    @Operation(summary = "Get product quantities pie chart data (individual products)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product quantities pie chart data retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid groupId"),
            @ApiResponse(responseCode = "500", description = "Internal error")
    })
    @GetMapping("/products")
    public ResponseEntity<List<ProductQuantityDto>> getProductQuantities(@RequestParam Integer groupId) {
        return ResponseEntity.ok(dashboardService.getProductQuantities(groupId));
    }
    @Operation(summary = "Get stock category pie chart data (Out of Stock, Low Stock, Normal Stock)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock category pie chart data retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid groupId"),
            @ApiResponse(responseCode = "500", description = "Internal error")
    })
    @GetMapping("/stock-categories")
    public ResponseEntity<List<ProductQuantityDto>> getStockCategoryChart(@RequestParam Integer groupId) {
        return ResponseEntity.ok(dashboardService.getStockCategoryChart(groupId));
    }
}
