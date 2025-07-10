package fr.sirine.stock_management_back.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockMovementDto {
    private Integer id;
    private Integer productId;
    private String productName;
    private Integer userId;
    private String userName;
    private String type;
    private int quantity;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private Integer groupId;
}
