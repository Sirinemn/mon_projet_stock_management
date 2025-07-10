package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.entities.*;
import fr.sirine.stock_management_back.repository.StockMovementRepository;
import fr.sirine.stock_management_back.service.impl.StockAlertService;
import fr.sirine.stock_management_back.service.impl.StockMovementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StockMovementServiceTest {
    @InjectMocks
    private StockMovementService stockMovementService;
    @Mock
    private StockMovementRepository stockMovementRepository;
    @Mock
    private IProductService productService;
    @Mock
    private IUserService userService;
    @Mock
    private StockAlertService stockAlertService;
    @Mock
    private IGroupService groupService;

    StockMovementDto stockMovementDto;
    Product product;
    User user;
    Category category;
    Group group;

    @BeforeEach
    public void setUp() {
        group = Group.builder()
                .id(1)
                .name("group")
                .build();
        category = Category.builder()
                .name("category")
                .build();
        user = User.builder()
                .firstname("user")
                .lastname("user")
                .password("password")
                .email("email")
                .group(group)
                .build();
        product = Product.builder()
                .name("product")
                .quantity(10)
                .price(100)
                .user(user)
                .category(category)
                .group(group)
                .description("description")
                .build();
        stockMovementDto = StockMovementDto.builder()
                .userId(1)
                .productId(1)
                .quantity(5)
                .type("ENTREE")
                .groupId(group.getId())
                .build();
    }
    @Test
    public void addStockMovementTest() {
        when(groupService.findById(1)).thenReturn(group);
        when(productService.findById(1)).thenReturn(product);
        when(userService.findById(1)).thenReturn(user);
        when(productService.updateProduct(any(ProductDto.class))).thenReturn(new ProductDto());
        doNothing().when(stockAlertService).checkStockLevel(any(Product.class));

        stockMovementService.addStockMovement(stockMovementDto);

        verify(stockMovementRepository, times(1)).save(any(StockMovement.class));
        verify(stockAlertService, times(1)).checkStockLevel(any(Product.class));
        verify(productService, times(1)).updateProduct(any(ProductDto.class));
    }
    @Test
    public void getStockMovementsByProductTest() {
        stockMovementService.getStockMovementsByProduct(1,1);

        verify(stockMovementRepository, times(1)).findByProductIdAndGroupId(1,1);
    }
}
