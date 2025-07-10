package fr.sirine.stock_management_back.repository;

import fr.sirine.stock_management_back.entities.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Integer> {
    List<StockMovement> findAllByProductId(Integer productId);
    List<StockMovement> findByUserId(Integer userId);
    List<StockMovement> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<StockMovement> findByUserIdAndProductIdAndGroupIdAndCreatedDateBetween(Integer userId, Integer productId, Integer groupId, LocalDateTime startDate, LocalDateTime endDate);
    List<StockMovement> findByGroupId(Integer groupId);
    List<StockMovement> findTop10ByGroupIdOrderByCreatedDateDesc(Integer groupId);
    List<StockMovement> findByProductIdAndGroupId(Integer productId, Integer groupId);

    boolean existsByProductIdAndGroupId(Integer productId, Integer groupId);

    List<StockMovement> findByUserIdAndProductIdAndGroupId(Integer userId, Integer productId, Integer groupId);

    List<StockMovement> findByUserIdAndProductIdAndCreatedDateBetween(Integer userId, Integer productId, LocalDateTime startDate, LocalDateTime endDate);

    List<StockMovement> findByUserIdAndProductId(Integer userId, Integer productId);

    List<StockMovement> findByUserIdAndGroupId(Integer userId, Integer groupId);

    List<StockMovement> findByUserIdAndProductIdAndGroupIdAndCreatedDate(Integer userId, Integer productId, Integer groupId, LocalDateTime startDate);

    List<StockMovement> findByProductIdAndCreatedDateBetween(Integer productId, LocalDateTime startDate, LocalDateTime endDate);

    List<StockMovement> findByGroupIdAndCreatedDateBetween(Integer groupId, LocalDateTime startDate, LocalDateTime endDate);

    List<StockMovement> findByGroupIdOrderByCreatedDateDesc(Integer groupId);
}
