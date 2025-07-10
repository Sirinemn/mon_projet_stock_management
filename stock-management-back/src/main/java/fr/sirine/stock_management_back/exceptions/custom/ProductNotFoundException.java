package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class ProductNotFoundException extends RuntimeException{
    private final BusinessErrorCodes businessErrorCodes;

    public ProductNotFoundException() {
        super(BusinessErrorCodes.PRODUCT_NOT_FOUND.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.PRODUCT_NOT_FOUND;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }

}
