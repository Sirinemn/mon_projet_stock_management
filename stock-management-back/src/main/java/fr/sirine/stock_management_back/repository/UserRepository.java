package fr.sirine.stock_management_back.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import fr.sirine.stock_management_back.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByRoles_Name(String role);
    List<User> findByCreatedBy_Id(Integer adminId);

    List<User> findByGroupId(Integer groupId);
}
