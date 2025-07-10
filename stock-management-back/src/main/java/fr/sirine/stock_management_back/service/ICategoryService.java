package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.entities.Category;

import java.util.List;

public interface ICategoryService {
    List<CategoryDto> getAllCategories(Integer userId);
    void addCategory(String categoryName, Integer userId);
    void deleteCategory(Integer id);
    Category findById(Integer categoryId);
}

