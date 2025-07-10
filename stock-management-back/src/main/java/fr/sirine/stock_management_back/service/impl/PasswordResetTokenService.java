package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.email.EmailService;
import fr.sirine.stock_management_back.entities.PasswordResetToken;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.LinkExpiredException;
import fr.sirine.stock_management_back.exceptions.custom.UserNotFoundException;
import fr.sirine.stock_management_back.repository.PasswordResetTokenRepository;
import fr.sirine.stock_management_back.service.IUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository tokenRepository;
    private final IUserService userService;
    private final EmailService emailService;
    @Value("${app.front.url}")
    private String frontendUrl;

    public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository, IUserService userService, EmailService emailService) {
        this.tokenRepository = passwordResetTokenRepository;
        this.userService = userService;
        this.emailService = emailService;
    }
    public void processPasswordResetRequest(String email) {
        try {
            User user = userService.findByEmail(email);

            // Supprimer les anciens tokens pour cet utilisateur
            tokenRepository.findByToken(user.getEmail()).ifPresent(tokenRepository::delete);

            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30);
            PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);

            tokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password/" + token;
            Map<String, Object> variables = new HashMap<>();
            variables.put("resetLink", resetLink);
            variables.put("username", user.getFullName());
            System.out.println(resetLink);

            emailService.sendEmail(
                    email,
                    "Réinitialisation de votre mot de passe",
                    "emails/reset-password",
                    variables
            );
        } catch (UserNotFoundException e) {

        }
    }
    public Optional<User> validatePasswordResetToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.isExpired())
                .map(PasswordResetToken::getUser);
    }
    public boolean isTokenValid(String token) {
        return tokenRepository.findByToken(token)
                .map(t -> !t.isExpired())
                .orElse(false);
    }
    public User getUserByToken(String token) {
        return tokenRepository.findUserByToken(token)
                .orElseThrow(UserNotFoundException::new);
    }
    public void deleteToken(String token) {
        tokenRepository.findByToken(token).ifPresent(tokenRepository::delete);
    }
}
