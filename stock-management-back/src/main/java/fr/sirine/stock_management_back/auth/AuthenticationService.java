package fr.sirine.stock_management_back.auth;

import fr.sirine.stock_management_back.email.EmailService;
import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.*;
import fr.sirine.stock_management_back.jwt.JwtService;
import fr.sirine.stock_management_back.payload.request.ChangePasswordRequest;
import fr.sirine.stock_management_back.payload.request.LoginRequest;
import fr.sirine.stock_management_back.payload.request.RegisterAdminRequest;
import fr.sirine.stock_management_back.payload.request.RegisterUserRequest;
import fr.sirine.stock_management_back.payload.response.AuthenticationResponse;
import fr.sirine.stock_management_back.repository.GroupRepository;
import fr.sirine.stock_management_back.repository.RoleRepository;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {
    @Value("${app.front.url}")
    private String loginUrl;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final SessionRegistry sessionRegistry;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final GroupRepository groupRepository;


    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, JwtService jwtService, PasswordEncoder passwordEncoder, SessionRegistry sessionRegistry, EmailService emailService, AuthenticationManager authenticationManager, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.sessionRegistry = sessionRegistry;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
        this.groupRepository = groupRepository;
    }

    public User register(RegisterUserRequest request, String role, User admin) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException();
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setGroup(admin.getGroup());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Utiliser le mot de passe saisi par l'admin
        user.setRoles(List.of(roleRepository.findByName(role).orElseThrow(RoleNotFoundException::new)));

        // Appliquer firstLogin uniquement pour les utilisateurs normaux (USER)
        if ("USER".equalsIgnoreCase(role)) {
            user.setFirstLogin(true);
        } else {
        user.setFirstLogin(false); // Explicite pour les ADMINs
        }
        user.setCreatedBy(admin);

        userRepository.save(user);

        int passwordLength = request.getPassword().length();

        Map<String, Object> emailMessage = Map.of(
                "firstname", user.getFirstname(),
                "lastname", user.getLastname(),
                "email", user.getEmail(),
                "password", request.getPassword().substring(0, 3) + "*".repeat(passwordLength - 3),
                "loginurl", loginUrl+"/auth/login");


        emailService.sendEmail(user.getEmail(), "Inscription réussie","emails/registration" , emailMessage);
        return user;
    }
    public User registerAdmin(RegisterAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException();
        }

        Optional<Group> existingGroup = groupRepository.findByName(request.getGroupName());
        if (existingGroup.isPresent()) {
            throw new GroupAlreadyExistException("Group name already taken");
        }
        // Création du groupe avec le nom fourni
        Group group = new Group();
        group.setName(request.getGroupName());
        group = groupRepository.save(group);

        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setFirstname(request.getFirstname());
        admin.setLastname(request.getLastname());
        admin.setDateOfBirth(request.getDateOfBirth());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRoles(List.of(roleRepository.findByName("ADMIN").orElseThrow(RoleNotFoundException::new)));
        admin.setFirstLogin(false); // Explicite pour les ADMINs
        admin.setCreatedBy(null); // Aucun utilisateur ne l'a créé
        admin.setGroup(group);

        userRepository.save(admin);
        Map<String, Object> emailMessage = Map.of(
                "firstname", admin.getFirstname(),
                "lastname", admin.getLastname(),
                "loginurl", loginUrl+"/auth/login"
                );
        emailService.sendEmail(admin.getEmail(), "Inscription réussie","emails/registration_admin" , emailMessage);

        return admin;
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String userEmail = ((UserDetails) auth.getPrincipal()).getUsername();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(UserNotFoundException::new);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .userId(user.getId())
                .token(jwtToken)
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                .groupId(user.getGroup().getId())
                .build();
    }
    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(UserNotFoundException::new);
        Role role = new Role("USER");

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException();
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new SamePasswordException();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        if (user.getRoles().contains(role)) {
            user.setFirstLogin(false); // Désactiver le mode "première connexion"
        }
        userRepository.save(user);
        invalidateUserSessions(user.getEmail());
    }
    private void invalidateUserSessions(String username) {
        // Obtenir toutes les sessions de l'utilisateur
        sessionRegistry.getAllPrincipals().stream()
                .filter(p -> p instanceof UserDetails && ((UserDetails) p).getUsername().equals(username))
                .findFirst()
                .ifPresent(principal -> {
                    // Invalider chaque session
                    sessionRegistry.getAllSessions(principal, false).forEach(SessionInformation::expireNow);
                });
    }
    public User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

}
