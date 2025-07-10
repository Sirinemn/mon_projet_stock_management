package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;
import lombok.Getter;

@Getter
public class JwtTokenExpiredException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public JwtTokenExpiredException() {
        super(BusinessErrorCodes.JWT_TOKEN_EXPIRED.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.JWT_TOKEN_EXPIRED;
    }
}
