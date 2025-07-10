package fr.sirine.stock_management_back.mapper;

import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.service.impl.GroupService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Mapper(componentModel = "spring")
public abstract class CategoryMapper implements EntityMapper<CategoryDto, Category>{
    @Autowired
    private GroupService groupService;
    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "group.id", target = "groupId")
    public abstract CategoryDto toDto(Category entity);

    @Override
    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "groupId", target = "group", qualifiedByName = "findGroupById")
    public abstract Category toEntity(CategoryDto dto);

    @Named("findGroupById")
    Group findGroupById(Integer groupId) {
        return groupService.findById(groupId);
    }

}
