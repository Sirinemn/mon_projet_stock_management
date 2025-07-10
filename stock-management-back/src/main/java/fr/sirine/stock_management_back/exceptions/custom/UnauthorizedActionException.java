package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class UnauthorizedActionException extends RuntimeException{
    private final BusinessErrorCodes businessErrorCodes;

    public UnauthorizedActionException() {
        super(BusinessErrorCodes.UNAUTHORIZED_ACTION.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.UNAUTHORIZED_ACTION;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}
