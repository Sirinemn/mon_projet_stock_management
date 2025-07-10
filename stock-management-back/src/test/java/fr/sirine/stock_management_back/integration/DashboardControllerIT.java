package fr.sirine.stock_management_back.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.sirine.stock_management_back.dto.DashboardOverviewDto;
import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.service.impl.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DashboardControllerIT {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private DashboardService dashboardService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getDashboardOverview() throws Exception {
        Group group = Group.builder()
                .id(1)
                .name("group")
                .build();
        StockMovementDto stockMovementDto = StockMovementDto.builder()
                .productId(1)
                .quantity(10)
                .build();
        DashboardOverviewDto dashboardOverviewDto = DashboardOverviewDto.builder()
                .lowStockProducts(5L)
                .totalProducts(10L)
                .recentMovements(List.of(stockMovementDto))
                .build();
        when(dashboardService.getDashboardOverview(group.getId())).thenReturn(dashboardOverviewDto);
        MockHttpServletRequestBuilder request = get("/dashboard/overview")
                .param("groupId", String.valueOf(group.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dashboardOverviewDto));
        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lowStockProducts").value(5));
    }
}
