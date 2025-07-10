package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class InsufficientStockException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public InsufficientStockException() {
        super(BusinessErrorCodes.INSUFFICIENT_STOCK.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.INSUFFICIENT_STOCK;
    }

    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}

