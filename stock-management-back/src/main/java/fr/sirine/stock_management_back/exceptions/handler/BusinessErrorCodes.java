package fr.sirine.stock_management_back.exceptions.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@Getter
public enum BusinessErrorCodes {

    USER_NOT_FOUND(1001, "Utilisateur non trouvé", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_USED(1002, "Email déjà utilisé", HttpStatus.CONFLICT),
    UNAUTHORIZED_ACTION(1003, "Action non autorisée", HttpStatus.FORBIDDEN),
    INVALID_REQUEST(1004, "Requête invalide", HttpStatus.BAD_REQUEST),
    JWT_TOKEN_EXPIRED(1005, "Session expiré", HttpStatus.UNAUTHORIZED),
    ROLE_NOT_FOUND(1006, "Rôle non trouvé", HttpStatus.NOT_FOUND),
    BAD_CREDENTIALS(1007, "Login and / or Password is incorrect", FORBIDDEN),
    CATEGORY_NOT_FOUND(1008, "Catégorie non trouvée", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(1009, "Produit non trouvé", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(1010, "Stock insuffisant", HttpStatus.BAD_REQUEST),
    CATEGORY_ALREADY_EXIST(1011, "Catégorie déjà utilisée", HttpStatus.CONFLICT),
    EMAIL_SERVICE_ERROR(1012, "Erreur du service d'email", HttpStatus.INTERNAL_SERVER_ERROR),
    GROUP_ALREADY_EXIST(1013, "Nom d'entreprise déjà utilisé", HttpStatus.CONFLICT),
    GROUP_NOT_FOUND(1014, "Nom d'entreprise non trouvé", HttpStatus.NOT_FOUND),
    PRODUCT_ALREADY_EXIST(1015, "Nom du produit déja utilisé", HttpStatus.CONFLICT),
    ILLEGAL_STATE(1016, "État illégal", HttpStatus.BAD_REQUEST),
    STOCK_MOVEMENT_NOT_FOUND(1017, "Mouvement de stock non trouvé", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD(1018,"L\'ancien mot de passe est incorrect", HttpStatus.BAD_REQUEST),
    SAME_PASSWORD(1019, "Le nouveau mot de passe doit être différent de l'ancien", HttpStatus.BAD_REQUEST),
    LINK_EXPIRED(1020, "Le lien est expiré", HttpStatus.BAD_REQUEST ),
    INTERNAL_SERVER_ERROR(1021, "Erreur interne du serveur", HttpStatus.INTERNAL_SERVER_ERROR);


    private final int code;
    private final String description;
    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, String description, HttpStatus httpStatus) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }

}
