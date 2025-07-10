package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class StockMovementNotFoundException extends RuntimeException {
   private final BusinessErrorCodes errorCodes;

    public StockMovementNotFoundException() {
        super(BusinessErrorCodes.STOCK_MOVEMENT_NOT_FOUND.getDescription());
        this.errorCodes = BusinessErrorCodes.STOCK_MOVEMENT_NOT_FOUND;
    }
}
