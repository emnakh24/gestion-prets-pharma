package com.cliniSys.gestionprets.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cliniSys.gestionprets.entity.Admin;
import com.cliniSys.gestionprets.repository.AdminRepository;
import com.cliniSys.gestionprets.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Admin admin = adminRepository.findByUsername(username)
                .orElse(null);

        if (admin == null || !passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Identifiants incorrects"));
        }

        String token = jwtUtil.generateToken(admin.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", admin.getUsername()));
    }
}