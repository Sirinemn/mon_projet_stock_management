package fr.sirine.stock_management_back.exceptions.custom;

import fr.sirine.stock_management_back.exceptions.handler.BusinessErrorCodes;

public class LinkExpiredException extends RuntimeException {
    private final BusinessErrorCodes businessErrorCodes;

    public LinkExpiredException() {
        super(BusinessErrorCodes.LINK_EXPIRED.getDescription());
        this.businessErrorCodes = BusinessErrorCodes.LINK_EXPIRED;
    }
}
