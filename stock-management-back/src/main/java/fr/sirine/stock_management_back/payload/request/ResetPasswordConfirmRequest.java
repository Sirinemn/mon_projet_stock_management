package fr.sirine.stock_management_back.payload.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ResetPasswordConfirmRequest {
    private String token;
    private String newPassword;
}
