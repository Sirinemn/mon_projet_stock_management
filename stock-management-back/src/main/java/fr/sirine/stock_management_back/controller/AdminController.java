package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.IllegalStateException;
import fr.sirine.stock_management_back.mapper.UserMapper;
import fr.sirine.stock_management_back.payload.response.MessageResponse;
import fr.sirine.stock_management_back.service.ICategoryService;
import fr.sirine.stock_management_back.service.IGroupService;
import fr.sirine.stock_management_back.service.IProductService;
import fr.sirine.stock_management_back.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin Management", description = "Admin operations for managing users and categories")
public class AdminController {

    private final IUserService userService;
    private final UserMapper userMapper;
    private final ICategoryService categoryService;
    private final IProductService productService;
    private final IGroupService groupService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    public AdminController(IUserService userService, UserMapper userMapper, ICategoryService categoryService, IProductService productService, IGroupService groupService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.categoryService = categoryService;
        this.productService = productService;
        this.groupService = groupService;
        logger.info("AdminController initialized");
    }

    @Operation(summary = "Get all users", description = "Retrieve a list of all users")
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserDto> getAllUsers(@RequestParam("id") Integer id) {
        logger.info("Test Logger Info");
        return userService.getUsersByAdmin(id);
    }
    @Operation(summary = "Get user by ID", description = "Retrieve a user by their ID")
    @GetMapping("/user/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDto> getUser(@PathVariable String id) throws IOException {

        User user = userService.findById(Integer.parseInt(id));
        return ResponseEntity.ok(this.userMapper.toDto(user));
    }
    @Operation(summary = "Update user", description = "Update a user's details by their ID")
    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MessageResponse> updateUser(@PathVariable String id,
                                                      @RequestBody @Valid UserDto userDto
                                                      ) {
        userService.updateUserById(Integer.parseInt(id), userDto);
        MessageResponse messageResponse = new MessageResponse("Updated with success!");
        return new ResponseEntity<>( messageResponse, HttpStatus.OK);
    }
    @Operation(summary = "Delete user", description = "Delete a user by their ID")
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @Operation(summary = "Delete a category", description = "Admin can delete a category by ID")
    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id, @RequestParam Integer groupId) {
        boolean hasProducts = productService.existsByCategoryIdAndGroupId(id, groupId);
        if (hasProducts) {
            throw new IllegalStateException("Impossible de supprimer la catégorie car elle contient des produits.");
        } else {
            categoryService.deleteCategory(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
    @Operation(summary = "Add a category", description = "Admin can add a new category")
    @PostMapping("/category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MessageResponse> addCategory(@RequestParam("name") @NotBlank @Size(max = 63) String name, @RequestParam("userId") @Valid Integer userId) {
        categoryService.addCategory(name, userId);
        MessageResponse messageResponse = new MessageResponse("Category added with success!");
        return new ResponseEntity<>( messageResponse, HttpStatus.CREATED);
    }
    @Operation(summary = "Get all users by group ID", description = "Retrieve a list of all users by their group ID")
    @GetMapping("/users/group/{groupId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsersByGroupId(@PathVariable Integer groupId) {
        List<UserDto> users = userService.findByGroupId(groupId);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @Operation(summary = "Update group name", description = "Update the name of a group by its ID")
    @PutMapping("/group/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MessageResponse> updateGroup(@PathVariable Integer userId, @RequestParam("groupName") @NotBlank @Size(max = 63) String groupName) {
        User user = userService.findById(userId);
        groupService.updateGroup(user.getGroup().getId(), groupName);
        MessageResponse messageResponse = new MessageResponse("updated with success!");
        return new ResponseEntity<>( messageResponse, HttpStatus.OK);
    }
}
