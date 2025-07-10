package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.DashboardOverviewDto;
import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Product;
import fr.sirine.stock_management_back.service.impl.DashboardService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {
    @InjectMocks
    private DashboardService dashboardService;
    @Mock
    private IProductService productService;
    @Mock
    private IStockMovementService stockMovementService;

    @Test
    void shouldReturnDashboardOverview() {
        // Given
        Group group = Group.builder()
                .id(1)
                .name("group")
                .build();
        StockMovementDto stockMovementDto = StockMovementDto.builder()
                .userId(1)
                .productId(1)
                .quantity(1)
                .createdDate(LocalDateTime.now())
                .type("SORTIE")
                .build();
        DashboardOverviewDto dashboardOverviewDto = DashboardOverviewDto.builder()
                .totalProducts(1)
                .lowStockProducts(1)
                .recentMovements(List.of(stockMovementDto))
                .build();
        ProductDto pr = ProductDto.builder()
                .id(1)
                .name("product")
                .quantity(5)
                .threshold(10)
                .groupId(group.getId())
                .build();
        // When
        when(productService.countByGroupId(group.getId())).thenReturn(1L);
        when(productService.findAllByGroupId(group.getId()))
                .thenReturn(List.of(pr));
        when(stockMovementService.findTop10ByGroupIdOrderByDateDesc(group.getId()))
                .thenReturn(List.of(stockMovementDto));
        when(stockMovementService.findTop10ByGroupIdOrderByDateDesc(group.getId())).thenReturn(List.of(stockMovementDto));
        // Then
        DashboardOverviewDto result = dashboardService.getDashboardOverview(group.getId());
        assertEquals(1, result.getTotalProducts());
    }
}
