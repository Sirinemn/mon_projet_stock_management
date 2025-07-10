package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.mapper.CategoryMapper;
import fr.sirine.stock_management_back.repository.CategoryRepository;
import fr.sirine.stock_management_back.service.impl.CategoryService;
import fr.sirine.stock_management_back.service.impl.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private CategoryMapper categoryMapper;
    @InjectMocks
    private CategoryService categoryService;
    @Mock
    private UserService userService;
    @Mock
    private IProductService productService;

    private Category category;
    private CategoryDto categoryDto;
    private User user;
    private Group group;

    @BeforeEach
    void setUp() {
        group = Group.builder()
                .id(1)
                .name("group")
                .build();
        user = User.builder()
                .id(1)
                .firstname("john")
                .lastname("Doe")
                .group(group)
                .build();
        category = Category.builder()
                .id(1)
                .name("category")
                .group(group)
                .build();
        categoryDto = CategoryDto.builder()
                .id(1)
                .name("category")
                .groupId(group.getId())
                .build();
    }
    @Test
    void should_get_all_categories() {
        when(categoryRepository.findByGroupId(any(Integer.class))).thenReturn(List.of(category));
        when(categoryMapper.toDto(category)).thenReturn(categoryDto);
        categoryService.getAllCategories(user.getId());
        verify(categoryRepository, times(1)).findByGroupId(any(Integer.class));
    }
    @Test
    void should_add_category() {
        when(userService.findById(anyInt())).thenReturn(user);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        categoryService.addCategory("category", user.getId());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }
    @Test
    void should_delete_category() {
        categoryService.deleteCategory(1);
        verify(categoryRepository, times(1)).deleteById(1);
    }
    @Test
    void should_find_category_by_id() {
        when(categoryRepository.findById(1)).thenReturn(java.util.Optional.of(category));
        categoryService.findById(1);
        verify(categoryRepository, times(1)).findById(1);
    }

}
