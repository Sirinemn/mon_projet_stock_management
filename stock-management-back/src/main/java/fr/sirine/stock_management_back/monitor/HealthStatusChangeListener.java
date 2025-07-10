package fr.sirine.stock_management_back.monitor;

import fr.sirine.stock_management_back.email.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class HealthStatusChangeListener {

    private final HealthEndpoint healthEndpoint;
    private final EmailService emailService;

    @Value("${monitor.email}")
    private String monitoringEmail;

    private Status lastStatus = Status.UP;
    private static final Logger logger = LoggerFactory.getLogger(HealthStatusChangeListener.class);

    public HealthStatusChangeListener(HealthEndpoint healthEndpoint, EmailService emailService) {
        this.healthEndpoint = healthEndpoint;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkHealth() {
        HealthComponent component = healthEndpoint.health();
        if (component instanceof CompositeHealth compositeHealth) {
            Map<String, HealthComponent> components = compositeHealth.getComponents();
            for (Map.Entry<String, HealthComponent> entry : components.entrySet()) {
                String name = entry.getKey();
                HealthComponent comp = entry.getValue();
                if (comp instanceof Health health && health.getStatus() == Status.DOWN) {
                    logger.warn("Component {} is DOWN", name);
                    sendEmailAlert(name, health.getStatus(), health.getDetails());
                }
            }
        }
    }

    private void sendEmailAlert(String componentName, Status status, Map<String, Object> details) {
        emailService.sendEmail(
                monitoringEmail,
                "StockZen - ⚠️ Le composant " + componentName + " est DOWN",
                "emails/health-alert",
                Map.of(
                        "status", status.getCode(),
                        "component", componentName,
                        "details", details.toString()
                )
        );
    }

}
