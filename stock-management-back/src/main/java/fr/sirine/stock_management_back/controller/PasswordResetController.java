package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.dto.UserDto;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.UserNotFoundException;
import fr.sirine.stock_management_back.mapper.UserMapper;
import fr.sirine.stock_management_back.payload.request.ResetPasswordConfirmRequest;
import fr.sirine.stock_management_back.payload.request.ResetPasswordRequest;
import fr.sirine.stock_management_back.payload.response.MessageResponse;
import fr.sirine.stock_management_back.service.IUserService;
import fr.sirine.stock_management_back.service.impl.PasswordResetTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {
    private final PasswordResetTokenService tokenService;
    private final UserMapper userMapper;
    private final IUserService userService;

    public PasswordResetController(PasswordResetTokenService tokenService, UserMapper userMapper, IUserService userService) {
        this.tokenService = tokenService;
        this.userMapper = userMapper;
        this.userService = userService;
    }
    @PostMapping("/reset-password-request")
    public ResponseEntity<MessageResponse> requestResetPassword(@RequestBody ResetPasswordRequest request) {
        tokenService.processPasswordResetRequest(request.getEmail());
        MessageResponse messageResponse = new MessageResponse("Un email de réinitialisation a été envoyé si l’adresse est enregistrée.");
        return ResponseEntity.ok(messageResponse);
    }
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = tokenService.isTokenValid(token);

            if (!isValid) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Lien invalide ou expiré"));
            }

            User user = tokenService.getUserByToken(token);
            UserDto userDto = userMapper.toDto(user);

            return ResponseEntity.ok(userDto);

        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Lien invalide"));
        }
    }
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody ResetPasswordConfirmRequest request) {
        try {
            // Valider le token
            if (!tokenService.isTokenValid(request.getToken())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Lien invalide ou expiré"));
            }

            // Récupérer l'utilisateur
            User user = tokenService.getUserByToken(request.getToken());

            // Mettre à jour le mot de passe (vous devez implémenter cette méthode)
            userService.updatePassword(user.getId(), request.getNewPassword());

            // Supprimer le token utilisé
            tokenService.deleteToken(request.getToken());

            return ResponseEntity.ok(new MessageResponse("Mot de passe réinitialisé avec succès"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Erreur lors de la réinitialisation"));
        }
    }

}
