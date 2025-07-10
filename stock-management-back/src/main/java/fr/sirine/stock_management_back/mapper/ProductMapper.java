package fr.sirine.stock_management_back.mapper;

import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Product;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.service.impl.CategoryService;
import fr.sirine.stock_management_back.service.impl.GroupService;
import fr.sirine.stock_management_back.service.impl.UserService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", imports = {Product.class})
public abstract class ProductMapper implements EntityMapper<ProductDto, Product> {

    @Autowired
    UserService userService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private GroupService groupService;

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "user.group.id", target = "groupId")
    @Mapping(source = "user.group.name", target = "groupName")
    @Mapping(source = "user.fullName", target = "userName")
    public abstract ProductDto toDto(Product product);

    @Mapping(source = "userId", target = "user", qualifiedByName = "findUserById")
    @Mapping(source = "categoryId", target = "category", qualifiedByName = "findCategoryById")
    @Mapping(source = "groupId", target = "group", qualifiedByName = "findGroupById")
    public abstract Product toEntity(ProductDto productDto);

    @Named("findUserById")
    User findUserById(Integer userId) {
        return userService.findById(userId);
    }
    @Named("findCategoryById")
    Category findCategoryById(Integer categoryId) {
        return categoryService.findById(categoryId);
    }
    @Named("findGroupById")
    Group findGroupById(Integer groupId) {
        return groupService.findById(groupId);
    }
}
