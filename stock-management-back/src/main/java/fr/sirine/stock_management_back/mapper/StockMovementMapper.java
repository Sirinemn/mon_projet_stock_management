package fr.sirine.stock_management_back.mapper;

import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Product;
import fr.sirine.stock_management_back.entities.StockMovement;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.service.impl.GroupService;
import fr.sirine.stock_management_back.service.impl.ProductService;
import fr.sirine.stock_management_back.service.impl.UserService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring", imports = {Product.class})
public abstract class StockMovementMapper implements EntityMapper<StockMovementDto, StockMovement> {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;
    @Autowired
    private GroupService groupService;

    @Mapping(target = "productId", expression = "java(stockMovement.getProduct().getId())")
    @Mapping(target = "userId", expression = "java(stockMovement.getUser().getId())")
    @Mapping(target = "groupId", expression = "java(stockMovement.getGroup().getId())")
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "product.name", target = "productName")
    public abstract StockMovementDto toDto(StockMovement stockMovement);

    @Mapping(target = "product", source = "productId", qualifiedByName = "findProductById")
    @Mapping(target = "user", source = "userId", qualifiedByName = "findUserById")
    @Mapping(target = "group", source = "groupId", qualifiedByName = "findGroupById")
    public abstract StockMovement toEntity(StockMovementDto stockMovementDto);

    @Named("findProductById")
    Product findProductById(Integer productId) {
        return productService.findById(productId);
    }
    @Named("findUserById")
    User findUserById(Integer userId) {
        return userService.findById(userId);
    }
    @Named("findGroupById")
    Group findGroupById(Integer groupId) {
        return groupService.findById(groupId);
    }
}
