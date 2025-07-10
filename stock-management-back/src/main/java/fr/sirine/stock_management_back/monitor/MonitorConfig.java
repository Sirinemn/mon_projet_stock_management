package fr.sirine.stock_management_back.monitor;

import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.repository.GroupRepository;
import fr.sirine.stock_management_back.repository.RoleRepository;
import fr.sirine.stock_management_back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class MonitorConfig {

    private final MonitorAccountProperties monitorProps;

    @Bean
    @Order(2)
    public CommandLineRunner initMonitorUser(UserRepository userRepository,
                                             GroupRepository groupRepository,
                                             RoleRepository roleRepository,
                                             PasswordEncoder passwordEncoder) {
        return args -> {
            if (groupRepository.findByName(monitorProps.getGroup()).isEmpty()) {
                groupRepository.save(Group.builder().name(monitorProps.getGroup()).build());
            }
            if (userRepository.findByEmail(monitorProps.getEmail()).isEmpty()) {
                User monitorUser = new User();
                monitorUser.setFirstname(monitorProps.getFirstname());
                monitorUser.setLastname(monitorProps.getLastname());
                monitorUser.setEmail(monitorProps.getEmail());
                monitorUser.setGroup(
                        groupRepository.findByName(monitorProps.getGroup())
                                .orElseThrow(() -> new RuntimeException("Group not found: " + monitorProps.getGroup()))
                );
                monitorUser.setPassword(passwordEncoder.encode(monitorProps.getPassword()));
                Role monitorRole = roleRepository.findByName(monitorProps.getRole())
                        .orElseThrow(() -> new RuntimeException("Role not found: " + monitorProps.getRole()));
                monitorUser.setRoles(Collections.singletonList(monitorRole));
                userRepository.save(monitorUser);
            }
        };
    }
}
