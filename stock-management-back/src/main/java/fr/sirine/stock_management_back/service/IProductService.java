package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.entities.Product;

import java.util.List;

public interface IProductService {
    ProductDto createProduct(ProductDto productDto);
    Product findById(Integer id);
    void deleteProduct(Integer id);
    ProductDto updateProduct(ProductDto productDto);
    long countByGroupId(Integer groupId);
    long countByGroupIdAndQuantityLessThan(Integer groupId, int quantity);
    boolean existsByCategoryIdAndGroupId(Integer categoryId, Integer groupId);
    List<ProductDto> findAllByGroupId(Integer groupId);
    List<ProductDto> findAllByGroupIdAndCategoryId(Integer groupId, Integer categoryId);
}

