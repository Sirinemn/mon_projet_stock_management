package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.email.EmailService;
import fr.sirine.stock_management_back.payload.request.ContactRequest;
import fr.sirine.stock_management_back.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/contact")
public class ContactController {
    private final EmailService emailService;
    @Value("${app.mail.support}")
    String supportEmail;
    private final String template = "emails/contact-email";

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }
    @PostMapping
    public ResponseEntity<MessageResponse> sendContactEmail(@RequestBody ContactRequest contactRequest) {
        String subject = contactRequest.getSubject();
        Map<String, Object> variables = Map.of(
                "name", contactRequest.getName(),
                "email", contactRequest.getEmail(),
                "message", contactRequest.getMessage()
        );
        emailService.sendEmail(supportEmail, subject, template, variables);
        MessageResponse messageResponse = new MessageResponse("Message envoyé avec succès ! On vous répondra au plus vite");
        return ResponseEntity.ok(messageResponse);
    }
}
