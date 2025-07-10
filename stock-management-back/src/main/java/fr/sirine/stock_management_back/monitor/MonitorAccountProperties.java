package fr.sirine.stock_management_back.monitor;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "monitor")
@Getter
@Setter
public class MonitorAccountProperties {
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private String group;
    private String role;
}
