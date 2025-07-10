package fr.sirine.stock_management_back.dto;

import fr.sirine.stock_management_back.entities.Product;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {

    private Integer id;
    private String name;
    private String description;
    private int quantity;
    private double price;
    private int threshold;
    private Integer userId;
    private String userName; // Utilisé pour l'affichage
    private Integer categoryId; // Utilisé pour les requêtes
    private String categoryName; // Utilisé pour l'affichage
    private Integer groupId;   // Ajout du groupe
    private String groupName;

    public ProductDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.quantity = product.getQuantity();
        this.price = product.getPrice();
        this.threshold = product.getThreshold();
        this.userId = product.getUser().getId();
        this.categoryId = product.getCategory().getId();
        this.categoryName = product.getCategory().getName();
        this.groupId = product.getGroup().getId();
        this.groupName = product.getGroup().getName();
    }
}
