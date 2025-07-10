package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class EmailServiceException extends RuntimeException {
    private BusinessErrorCodes businessErrorCodes;

    public EmailServiceException() {
        super(BusinessErrorCodes.EMAIL_SERVICE_ERROR.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.EMAIL_SERVICE_ERROR;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}
