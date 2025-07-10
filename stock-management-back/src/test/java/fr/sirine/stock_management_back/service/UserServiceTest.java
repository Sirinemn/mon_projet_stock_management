package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.mapper.UserMapper;
import fr.sirine.stock_management_back.repository.UserRepository;
import fr.sirine.stock_management_back.service.impl.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private UserMapper userMapperSpy;

    @Mock
    private PasswordEncoder passwordEncoder;

    private User user;
    private UserDto userDto;
    private Role role;
    private User admin;
    private Role adminRole;
    private Group group;

    @BeforeEach
    void setUp() {
        group = Group.builder()
                .id(1)
                .name("group")
                .build();
        role = Role.builder()
                .id(1)
                .name("USER")
                .build();
        adminRole = Role.builder()
                .name("ADMIN")
                .build();
        user = User.builder()
                .id(1)
                .firstname("John")
                .lastname("Doe")
                .password("password")
                .email("john@oefr")
                .roles(List.of(role))
                .group(group)
                .build();
        userDto = UserDto.builder()
                .id(1)
                .firstname("John")
                .lastname("Doe")
                .email("john@oefr")
                .groupId(1)
                .groupName("group")
                .build();
        admin = User.builder()
                .id(2)
                .roles(List.of(adminRole))
                .firstname("admin")
                .email("admin@mail.fr")
                .build();
    }
    @Test
    void should_map_user_to_dto() {
        when(userMapper.toDto(user)).thenReturn(userDto);
        UserDto result = userMapper.toDto(user);
        assertEquals(user.getId(), result.getId());
    }
    @Test
    void should_find_user_by_id() {
        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(user));
        userService.findById(1);
        verify(userRepository, times(1)).findById(1);
    }
    @Test
    void should_update_user() {
        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(user));
        when(passwordEncoder.encode("password")).thenReturn("password");
        UserDto userDtoUpdated = UserDto.builder()
                .id(1)
                .firstname("Jane")
                .lastname("Doe")
                .email("jane@oefr")
                .build();

        userService.updateUser(userDtoUpdated, "password");

        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(user);
        assertEquals("Jane", user.getFirstname());
    }
    @Test
    void should_delete_user() {
        userService.deleteUser(1);
        verify(userRepository, times(1)).deleteById(1);
    }
    @Test
    void should_get_all_users() {
        when(userRepository.findByCreatedBy_Id(anyInt())).thenReturn(List.of(admin));
        List<UserDto> result = userService.getUsersByAdmin(admin.getId());
        verify(userRepository, times(1)).findByCreatedBy_Id(2);
        assertEquals(1, result.size());
    }
}
