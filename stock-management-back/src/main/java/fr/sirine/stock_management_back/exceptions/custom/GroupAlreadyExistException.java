package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class GroupAlreadyExistException extends RuntimeException{
    private BusinessErrorCodes businessErrorCodes;

    public GroupAlreadyExistException(String message) {
        super(BusinessErrorCodes.GROUP_ALREADY_EXIST.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.GROUP_ALREADY_EXIST;
    }
    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }

}
