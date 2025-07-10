package fr.sirine.stock_management_back.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.sirine.stock_management_back.StockManagementBackApplication;
import fr.sirine.stock_management_back.auth.AuthenticationService;
import fr.sirine.stock_management_back.payload.request.LoginRequest;
import fr.sirine.stock_management_back.payload.request.RegisterAdminRequest;
import fr.sirine.stock_management_back.payload.response.AuthenticationResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = StockManagementBackApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthentificationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthenticationService authenticationService;

    @Test
    void souldRegisterSuccessfully() throws Exception {
        RegisterAdminRequest registerAdminRequest = RegisterAdminRequest.builder()
                .firstname("firstname")
                .lastname("lastname")
                .email("email@test.fr")
                .dateOfBirth(LocalDateTime.now())
                .password("password")
                .groupName("group")
                .build();
        String registrationRequestJson = objectMapper.writeValueAsString(registerAdminRequest);
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registrationRequestJson);
        mockMvc.perform(request)
                .andExpect(status().isOk());
    }
    @Test
    void shouldreturnBadRequestWhenRegisteringWithInvalidRequest() throws Exception {
        RegisterAdminRequest registerAdminRequest = RegisterAdminRequest.builder()
                .firstname("firstname")
                .lastname("lastname")
                .email("email")
                .dateOfBirth(LocalDateTime.now())
                .password("password")
                .build();
        String registrationRequestJson = objectMapper.writeValueAsString(registerAdminRequest);
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registrationRequestJson);
        mockMvc.perform(request)
                .andExpect(status().isBadRequest());
    }
    @Test
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("email@test.fr")
                .password("password")
                .build();
        AuthenticationResponse authResponse = AuthenticationResponse.builder()
                .token("dummy-jwt-token")
                .userId(1)
                .roles(List.of("ROLE_USER")) // Assuming roles are returned like this
                .build();
        when(authenticationService.authenticate(any())).thenReturn(authResponse);

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequestJson);
        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("dummy-jwt-token"))
                .andExpect(jsonPath("$.userId").value(1));

    }
}
