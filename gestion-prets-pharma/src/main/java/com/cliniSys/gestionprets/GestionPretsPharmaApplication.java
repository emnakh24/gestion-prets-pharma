package com.cliniSys.gestionprets;

import com.cliniSys.gestionprets.entity.Admin;
import com.cliniSys.gestionprets.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class GestionPretsPharmaApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPretsPharmaApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                adminRepository.save(admin);
                System.out.println("Admin créé : admin / admin123");
            }
        };
    }
}