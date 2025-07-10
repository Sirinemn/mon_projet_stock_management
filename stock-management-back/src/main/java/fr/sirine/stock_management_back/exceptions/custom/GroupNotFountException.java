package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class GroupNotFountException extends RuntimeException {
    private BusinessErrorCodes errorCode;

    public GroupNotFountException(String message) {
        super(message);
        this.errorCode = BusinessErrorCodes.GROUP_NOT_FOUND;
    }
}
