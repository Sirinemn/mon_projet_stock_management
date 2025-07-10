package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class UserNotFoundException extends RuntimeException{
    private final BusinessErrorCodes businessErrorCodes;

    public UserNotFoundException() {
        super(BusinessErrorCodes.USER_NOT_FOUND.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.USER_NOT_FOUND;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}
