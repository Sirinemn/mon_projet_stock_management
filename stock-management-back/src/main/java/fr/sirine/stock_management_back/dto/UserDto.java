package fr.sirine.stock_management_back.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Integer id;
    private String firstname;
    private String lastname;
    private LocalDateTime dateOfBirth;
    private String email;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private boolean firstLogin;
    private List<String> roles;
    private Integer groupId;
    private String groupName;
    private Integer createdById;
}
