package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.dto.StockMovementDto;
import fr.sirine.stock_management_back.payload.request.StockMovementFilter;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface IStockMovementService {

    StockMovementDto addStockMovement(StockMovementDto stockMovementDto);
    List<StockMovementDto> getStockMovements(StockMovementFilter filter);
    List<StockMovementDto> getStockMovementsByProduct(Integer productId, Integer groupId);

    List<StockMovementDto> findTop10ByGroupIdOrderByDateDesc(Integer groupId);
    List<StockMovementDto> findByGroupIdOrderByDateDesc(Integer groupId);
    List<StockMovementDto> findByGroupId(Integer groupId);
    void deleteStockMovement(Integer productId);
    boolean hasStockMovement(Integer productId, Integer groupId);
    void updateStockMovement(Integer stockId, StockMovementDto stockMovementDto);
    StockMovementDto getStockMovementById(Integer stockId);

}
