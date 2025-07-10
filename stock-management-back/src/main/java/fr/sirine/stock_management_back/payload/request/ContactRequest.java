package fr.sirine.stock_management_back.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ContactRequest {
    String name;
    String subject;
    String email;
    String message;
}