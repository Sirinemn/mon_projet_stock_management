package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class IllegalStateException extends RuntimeException {

    private final BusinessErrorCodes businessErrorCodes;

    public IllegalStateException(String message) {
        super(message);
        this.businessErrorCodes = BusinessErrorCodes.ILLEGAL_STATE;
    }

}
