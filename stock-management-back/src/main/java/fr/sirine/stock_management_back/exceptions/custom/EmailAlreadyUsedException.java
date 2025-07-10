package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class EmailAlreadyUsedException extends RuntimeException{
    private final BusinessErrorCodes businessErrorCodes;

    public EmailAlreadyUsedException() {
        super(BusinessErrorCodes.EMAIL_ALREADY_USED.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.EMAIL_ALREADY_USED;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}
