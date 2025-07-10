package fr.sirine.stock_management_back.auth;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.email.EmailService;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.payload.request.ChangePasswordRequest;
import fr.sirine.stock_management_back.payload.request.LoginRequest;
import fr.sirine.stock_management_back.payload.request.RegisterAdminRequest;
import fr.sirine.stock_management_back.payload.request.RegisterUserRequest;
import fr.sirine.stock_management_back.payload.response.AuthenticationResponse;
import fr.sirine.stock_management_back.payload.response.MessageResponse;
import fr.sirine.stock_management_back.service.impl.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name="Authentication")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    public AuthenticationController(AuthenticationService authenticationService, EmailService emailService, UserService userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @Operation(summary = "Authentification utilisateur", description = "Permet à un utilisateur de se connecter avec ses identifiants")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentification réussie",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "401", description = "Authentification échouée")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        logger.info("User login request: " + loginRequest);
        return  ResponseEntity.ok(authenticationService.authenticate(loginRequest));
    }

    @Operation(summary = "Inscription administrateur", description = "Permet à un administrateur de s'inscrire en premier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "202", description = "Inscription réussie"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "409", description = "Conflit : l'email est déjà utilisé")
    })
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerAdmin(@RequestBody @Valid RegisterAdminRequest registerAdminRequest) {
        authenticationService.registerAdmin(registerAdminRequest);
        MessageResponse messageResponse = new MessageResponse("Inscription réussie");
        return ResponseEntity.ok(messageResponse);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Ajout d'un utilisateur par l'admin", description = "L'admin peut ajouter des utilisateurs")
    @PostMapping("/register/user")
    public ResponseEntity<MessageResponse> registerUser(@RequestBody @Valid RegisterUserRequest registerUserRequest) {
        User admin = authenticationService.getAuthenticatedUser(); // Récupération de l'admin connecté
        authenticationService.register(registerUserRequest, "USER", admin);
        MessageResponse messageResponse = new MessageResponse("Inscription réussie");
        return ResponseEntity.ok(messageResponse);
    }

    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Changement de mot de passe", description = "Permet à un utilisateur de changer son mot de passe")
    @PatchMapping("/users/change-password")
    public ResponseEntity<MessageResponse> changePassword(@RequestBody ChangePasswordRequest request) {
        authenticationService.changePassword(request);
        MessageResponse messageResponse = new MessageResponse("Mot de passe changé avec succès");
        return ResponseEntity.ok(messageResponse);
    }
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer les informations de l'utilisateur", description = "Récupérer les informations de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informations de l'utilisateur récupérées avec succès", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthenticationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    public ResponseEntity<UserDto> getUserInfo(@PathVariable Integer id) {
        UserDto userDto = userService.getById(id);
        return ResponseEntity.ok(userDto);
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    @Operation(summary = "Récupérer les informations de l'utilisateur connecté", description = "Récupérer les informations de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informations de l'utilisateur récupérées avec succès", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthenticationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    public ResponseEntity<UserDto> getCurrentUserInfo() {
        User user = authenticationService.getAuthenticatedUser();
        UserDto userDto = userService.getById(user.getId());
        return ResponseEntity.ok(userDto);
    }

}
