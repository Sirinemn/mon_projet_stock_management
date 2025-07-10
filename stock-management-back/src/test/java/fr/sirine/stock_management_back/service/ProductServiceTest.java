package fr.sirine.stock_management_back.service;


import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Product;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.mapper.ProductMapper;
import fr.sirine.stock_management_back.repository.ProductRepository;
import fr.sirine.stock_management_back.service.impl.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @InjectMocks
    private ProductService productService;
    @Mock
    private ProductRepository productRepository;
    @Mock private ICategoryService categoryService;
    @Mock private IUserService userService;
    @Mock private ProductMapper productMapper;

    private Product product;
    private ProductDto productDto;
    private Group group;
    @BeforeEach
    void setUp() {
        group = Group.builder()
                .id(1)
                .name("group")
                .build();
        product = Product.builder()
                .id(1)
                .group(group)
                .name("product")
                .price(10.0)
                .quantity(10)
                .build();
        productDto = ProductDto.builder()
                .id(1)
                .name("product")
                .price(10.0)
                .quantity(10)
                .categoryId(1)
                .userId(2)
                .groupId(group.getId())
                .build();
    }

    @Test
    void should_find_product_by_id() {
        when(productRepository.findById(1)).thenReturn(Optional.ofNullable(product));
        productService.findById(1);
        verify(productRepository, times(1)).findById(1);
    }

    @Test
    void testCreateProduct() {
        // Arrange
        Category category = Category.builder()
                .id(1)
                .name("category")
                .build();
        User user = User.builder()
                .id(2)
                .email("test@mail.fr")
                .password("password")
                .lastname("lastname")
                .firstname("firstname")
                .group(group)
                .build();
        Product mappedProduct = Product.builder()
                .id(1)
                .name("product")
                .price(10.0)
                .quantity(10)
                .build();

        when(categoryService.findById(1)).thenReturn(category);
        when(userService.findById(2)).thenReturn(user);
        when(productMapper.toEntity(productDto)).thenReturn(mappedProduct); // Mock ProductMapper
        when(productRepository.save(mappedProduct)).thenReturn(mappedProduct); // Mock ProductRepository

        // Act & Assert
        assertDoesNotThrow(() -> productService.createProduct(productDto));

        // Additional Verification
        verify(categoryService, times(1)).findById(1);
        verify(userService, times(1)).findById(2);
        verify(productMapper, times(1)).toEntity(productDto);
        verify(productRepository, times(1)).save(mappedProduct);
    }
    @Test
    void should_delete_product() {
        doNothing().when(productRepository).deleteById(1);
        productService.deleteProduct(1);
        verify(productRepository, times(1)).deleteById(1);
    }
    @Test
    void should_update_product() {
        when(productRepository.findById(1)).thenReturn(Optional.ofNullable(product));
        when(productRepository.save(product)).thenReturn(product);
        productService.updateProduct(productDto);
        verify(productRepository, times(1)).findById(1);
    }
}
