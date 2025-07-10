package fr.sirine.stock_management_back.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.mapper.UserMapper;
import fr.sirine.stock_management_back.repository.CategoryRepository;
import fr.sirine.stock_management_back.repository.GroupRepository;
import fr.sirine.stock_management_back.repository.RoleRepository;
import fr.sirine.stock_management_back.repository.UserRepository;
import fr.sirine.stock_management_back.service.impl.CategoryService;
import fr.sirine.stock_management_back.service.impl.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AdminControllerIT {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private UserDto userDto;
    private Category category;
    private Group group;
    private User admin;
    private Role adminRole;
    private Role userRole;
    private Role monitorRole;

    @BeforeEach
    void setUp() {
        adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name("ADMIN")
                            .build();
                    return roleRepository.save(newRole);
                });
        monitorRole = roleRepository.findByName("MONITORING")
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name("MONITORING")
                            .build();
                    return roleRepository.save(newRole);
                });
        userRole = roleRepository.findByName("USER")
                        .orElseGet(()-> {
                            Role newRole = Role.builder()
                                    .name("USER")
                                    .build();
                            return roleRepository.save(newRole);
                        });
        roleRepository.save(adminRole);
        group = Group.builder()
                .name("group")
                .build();
        groupRepository.save(group);
        admin = User.builder()
                .roles(List.of(adminRole))
                .group(group)
                .build();
        userRepository.save(admin);
        user = User.builder()
                .firstname("firstname")
                .lastname("lastname")
                .email("john@doe.fr")
                .group(group)
                .password("password")
                .createdBy(admin)
                .roles(List.of(userRole))
                .build();
        userRepository.save(user);
        userDto = UserDto.builder()
                .firstname("firstname")
                .lastname("lastname")
                .email("john@doe.fr")
                .build();
        category = Category.builder()
                .name("category")
                .group(group)
                .build();
        categoryRepository.save(category);
    }
    @AfterEach
    void cleanUp() {
        categoryRepository.deleteAll();
        userRepository.deleteAll();
        groupRepository.deleteAll();
        roleRepository.deleteAll();
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void shouldReturnAllUsers() throws Exception {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get("/admin/users").param("id", String.valueOf(admin.getId()));
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void shouldReturnUserById() throws Exception {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get("/admin/users").param("id", String.valueOf(user.getId()));
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void shouldUpdateUser() throws Exception {
        String userDtoJson = objectMapper.writeValueAsString(userDto);
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.put("/admin/users/"+user.getId())
                .content(userDtoJson)
                .contentType(MediaType.APPLICATION_JSON);
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void shouldDeleteUser() throws Exception {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.delete("/admin/users/"+user.getId());
        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void shouldDeleteCategory() throws Exception {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.delete("/admin/categories/"+category.getId()).param("groupId", String.valueOf(group.getId()));
        mockMvc.perform(request)
                .andExpect(status().isNoContent());
    }
    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void should_add_category() throws Exception {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/admin/category")
                .param("name", "newCategory")
                .param("userId", String.valueOf(admin.getId()));
        mockMvc.perform(request)
                .andExpect(jsonPath("$.message").value("Category added with success!"))
                .andExpect(status().isCreated());
    }
}
