package fr.sirine.stock_management_back.repository;

import fr.sirine.stock_management_back.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByUserId(Long userId);

    long countByQuantityLessThan(int i);

    Optional<Product> findByNameAndGroupId(String name, Integer integer);

    List<Product> findAllByGroupId(Integer groupId);

    boolean existsByCategoryIdAndGroupId(Integer categoryId, Integer groupId);

    List<Product> findAllByGroupIdAndCategoryId(Integer groupId, Integer categoryId);
}
