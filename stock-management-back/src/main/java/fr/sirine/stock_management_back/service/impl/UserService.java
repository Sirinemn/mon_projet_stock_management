package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.UserNotFoundException;
import fr.sirine.stock_management_back.mapper.UserMapper;
import fr.sirine.stock_management_back.repository.UserRepository;
import fr.sirine.stock_management_back.service.IGroupService;
import fr.sirine.stock_management_back.service.IUserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;
    private final IGroupService groupService;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, IGroupService groupService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.groupService = groupService;
    }

    public UserDto getById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        return userMapper.toDto(user);
    }
    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public List<UserDto> getUsersByAdmin(Integer adminId) {
        return userRepository.findByCreatedBy_Id(adminId)
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }
    public void updateUser( UserDto userDto, String password) {
        User initialUser = findById(userDto.getId());
        LocalDateTime now = LocalDateTime.now();
        if (initialUser!= null) {
            initialUser.setFirstname(userDto.getFirstname());
            initialUser.setLastname(userDto.getLastname());
            initialUser.setPassword(passwordEncoder.encode(password));
            initialUser.setEmail(userDto.getEmail());
            initialUser.setLastModifiedDate(now);
            userRepository.save(initialUser);
        }
    }
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        if (user.getRoles().stream().map(Role::getName).anyMatch(role -> role.equals("ADMIN"))) {
            Group group = groupService.findById(user.getGroup().getId());
            this.userRepository.deleteById(id);
            groupService.deleteGroup(group.getId());
        } else {
            this.userRepository.deleteById(id);
        }
    }
    public List<UserDto> findByRole(String role) {
        List<User> users = userRepository.findByRoles_Name(role);
        return users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public void updateUserById(Integer id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setEmail(userDto.getEmail());
        user.setDateOfBirth(userDto.getDateOfBirth());
        userRepository.save(user);
    }
    public List<UserDto> findByGroupId(Integer groupId) {
        return userRepository.findByGroupId(groupId)
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

    @Override
    public void updatePassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        user.setPassword(passwordEncoder.encode(newPassword));
    }
}
