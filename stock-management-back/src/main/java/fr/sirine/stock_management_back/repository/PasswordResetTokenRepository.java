package fr.sirine.stock_management_back.repository;

import fr.sirine.stock_management_back.entities.PasswordResetToken;
import fr.sirine.stock_management_back.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> findByToken(String token);
    @Query("SELECT p.user FROM PasswordResetToken p WHERE p.token = :token")
    Optional<User> findUserByToken(@Param("token") String token);

    // Optionnel : nettoyer les tokens expirés
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
