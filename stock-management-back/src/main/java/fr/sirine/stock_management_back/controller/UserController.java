package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.payload.response.MessageResponse;
import fr.sirine.stock_management_back.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
@PreAuthorize("hasAuthority('ADMIN')")
public class UserController {

    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get user by id", description = "Get user by id")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(Integer id) {
        return ResponseEntity.ok(userService.getById(id));
    }
    @Operation(summary = "Delete user by id", description = "Delete user by id")
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateUser(@PathVariable Integer id, @RequestBody @Valid UserDto userDto) {
        userService.updateUserById(id, userDto );
        return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
    }

}

