package fr.sirine.stock_management_back.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductQuantityDto {
    private String productName;
    private int quantity;
}
