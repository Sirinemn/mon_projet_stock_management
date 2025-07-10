package fr.sirine.stock_management_back.exceptions.custom;
import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;


public class RoleNotFoundException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public RoleNotFoundException() {
        super("Role not found: " + BusinessErrorCodes.ROLE_NOT_FOUND.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.ROLE_NOT_FOUND;
    }

    public BusinessErrorCodes getErrorCode() {
        return businessErrorCodes;
    }
}
