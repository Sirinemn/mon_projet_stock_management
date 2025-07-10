package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class SamePasswordException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public SamePasswordException() {
        super(BusinessErrorCodes.SAME_PASSWORD.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.SAME_PASSWORD;
    }
}
