package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class InvalidPasswordException extends RuntimeException{
    private final BusinessErrorCodes businessErrorCodes;

    public InvalidPasswordException() {
        super(BusinessErrorCodes.INVALID_PASSWORD.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.INVALID_PASSWORD;
    }
}
