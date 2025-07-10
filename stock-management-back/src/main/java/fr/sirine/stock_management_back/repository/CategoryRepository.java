package fr.sirine.stock_management_back.repository;

import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByNameAndGroupId(String name, Integer groupId);
    List<Category> findByGroupId(Integer groupId);
}
