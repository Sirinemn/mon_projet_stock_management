package fr.sirine.stock_management_back;

import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.entities.Role;
import fr.sirine.stock_management_back.repository.GroupRepository;
import fr.sirine.stock_management_back.repository.RoleRepository;
import fr.sirine.stock_management_back.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class StockManagementBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockManagementBackApplication.class, args);
	}

	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	@Order(1)
	public CommandLineRunner runner(RoleRepository roleRepository, UserRepository userRepository, GroupRepository groupRepository) {
		return args -> {
			if (roleRepository.findByName("USER").isEmpty()) {
				roleRepository.save(Role.builder().name("USER").build());
			}
			if (roleRepository.findByName("ADMIN").isEmpty()) {
				roleRepository.save(Role.builder().name("ADMIN").build());
			}
			if (roleRepository.findByName("MONITORING").isEmpty()) {
				roleRepository.save(Role.builder().name("MONITORING").build());
			}
			if (roleRepository.findByName("CLIENT").isEmpty()) {
				roleRepository.save(Role.builder().name("CLIENT").build());
			}
			if (roleRepository.findByName("SUPPLIER").isEmpty()) {
				roleRepository.save(Role.builder().name("SUPPLIER").build());
			}
			if (groupRepository.findByName("group").isEmpty()){
				groupRepository.save(Group.builder().name("group").build());
			}
		};
	}
}
