package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.CategoryAlreadyExistException;
import fr.sirine.stock_management_back.exceptions.custom.CategoryNotFoundException;
import fr.sirine.stock_management_back.exceptions.custom.IllegalStateException;
import fr.sirine.stock_management_back.mapper.CategoryMapper;
import fr.sirine.stock_management_back.repository.CategoryRepository;
import fr.sirine.stock_management_back.service.ICategoryService;
import fr.sirine.stock_management_back.service.IProductService;
import fr.sirine.stock_management_back.service.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final IUserService userService;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper, IUserService userService) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.userService = userService;
    }

    public List<CategoryDto> getAllCategories(Integer groupId) {
        List<Category> categories = categoryRepository.findByGroupId(groupId);
        return categories.stream().map(categoryMapper::toDto).toList();
    }
    public void addCategory(String categoryName, Integer userId) {
        User user = userService.findById(userId);
        if (categoryRepository.findByNameAndGroupId(categoryName, user.getGroup().getId()).isPresent()) {
            throw new CategoryAlreadyExistException();
        }else {
            Category category = new Category(categoryName);
            category.setGroup(user.getGroup());
            categoryRepository.save(category);
        }
    }
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
    public Category findById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);
    }

}
