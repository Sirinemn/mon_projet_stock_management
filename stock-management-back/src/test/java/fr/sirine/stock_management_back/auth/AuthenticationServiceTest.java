package fr.sirine.stock_management_back.auth;

import fr.sirine.stock_management_back.email.EmailService;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.EmailAlreadyUsedException;
import fr.sirine.stock_management_back.jwt.JwtService;
import fr.sirine.stock_management_back.payload.request.LoginRequest;
import fr.sirine.stock_management_back.payload.request.RegisterAdminRequest;
import fr.sirine.stock_management_back.payload.request.RegisterUserRequest;
import fr.sirine.stock_management_back.payload.response.AuthenticationResponse;
import fr.sirine.stock_management_back.repository.RoleRepository;
import fr.sirine.stock_management_back.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @InjectMocks
    private AuthenticationService authenticationService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private EmailService emailService;

    private RegisterUserRequest registerUserRequest;
    private LoginRequest loginRequest;
    private User user;
    private Role userRole;
    private Role adminRole;
    private User admin;
    @BeforeEach
    void setUp() {
        Group group = new Group("group");
        adminRole = new Role("ADMIN");
        userRole = new Role( "USER");
        admin = User.builder()
                .id(2)
                .firstname("admin")
                .lastname("admin")
                .email("admin@mail.fr")
                .roles(List.of(adminRole))
                .group(group)
                .build();

        registerUserRequest = new RegisterUserRequest("John", "Doe", LocalDateTime.now(), "john.doe@example.com", "password123");
        loginRequest = new LoginRequest("john.doe@example.com", "password123");

        user = User.builder()
                .id(1)
                .firstname("John")
                .lastname("Doe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .group(group)
                .roles(List.of(userRole))
                .build();

    }

    @Test
    void should_register() {
        when(userRepository.existsByEmail(registerUserRequest.getEmail())).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(registerUserRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString(), anyMap());

        authenticationService.register(registerUserRequest,"USER", admin);

        verify(userRepository, times(1)).save(any(User.class));

    }
    @Test
    void should_authenticate() {
        // Given
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mockJwtToken");

        // When
        AuthenticationResponse response = authenticationService.authenticate(loginRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getToken()).isEqualTo("mockJwtToken");
        assertThat(response.getRoles()).containsExactly("USER");

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));

    }

    @Test
    void shouldThrowExceptionWhenUserNotFoundDuringAuthentication() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new UsernameNotFoundException("User not found"));

        // When / Then
        assertThatThrownBy(() -> authenticationService.authenticate(loginRequest))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyUsed() {
        // Given
        when(userRepository.existsByEmail(registerUserRequest.getEmail())).thenReturn(true);

        // When / Then
        assertThatThrownBy(() -> authenticationService.register(registerUserRequest,"USER", admin))
                .isInstanceOf(EmailAlreadyUsedException.class);
    }

}
