package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.User;

import java.util.List;

public interface IUserService {
    User findById(Integer id);
    UserDto getById(Integer id);
    List<UserDto> getUsersByAdmin(Integer adminId);
    void updateUser(UserDto userDto, String password);
    void deleteUser(Integer id);
    void updateUserById(Integer id, UserDto userDto);
    List<UserDto> findByRole(String role);
    List<UserDto> findByGroupId(Integer groupId);
    User findByEmail(String email);
    void updatePassword(Integer userId, String newPassword);
}
