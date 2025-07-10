package fr.sirine.stock_management_back.mapper;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.service.impl.GroupService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
@Component
@Mapper(componentModel = "spring", imports = {User.class, Role.class})
public abstract class UserMapper implements EntityMapper<UserDto, User> {

    @Autowired
    private GroupService groupService;

    @Mapping(target = "roles", qualifiedByName = "rolesToStringList")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "groupName", source = "group.name")
    @Mapping(source = "firstLogin", target = "firstLogin")
    public abstract UserDto toDto(User user);

    @Mapping(target = "roles", qualifiedByName = "stringListToRoles")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(source = "groupId", target = "group", qualifiedByName = "findGroupById")
    public abstract User toEntity(UserDto userDto);

    @Named("rolesToStringList")
     List<String> rolesToStringList(List<Role> roles) {
        return roles.stream().map(Role::getName).collect(Collectors.toList());
    }

    @Named("stringListToRoles")
     List<Role> stringListToRoles(List<String> roleNames) {
        return roleNames.stream()
                .map(roleName -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return role;
                })
                .collect(Collectors.toList());
    }
    @Named("findGroupById")
    Group findGroupById(Integer groupId) {
        return groupService.findById(groupId);
    }
}
