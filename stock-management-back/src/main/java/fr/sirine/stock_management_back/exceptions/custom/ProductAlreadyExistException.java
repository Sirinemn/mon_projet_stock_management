package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;


public class ProductAlreadyExistException extends RuntimeException{
    private BusinessErrorCodes businessErrorCodes;

    public ProductAlreadyExistException(String message) {
        super(message);
        this.businessErrorCodes = BusinessErrorCodes.PRODUCT_ALREADY_EXIST;
    }
}
