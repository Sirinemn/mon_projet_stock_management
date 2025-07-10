package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class CategoryAlreadyExistException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public CategoryAlreadyExistException() {
        super(BusinessErrorCodes.CATEGORY_ALREADY_EXIST.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.CATEGORY_ALREADY_EXIST;
    }
}
