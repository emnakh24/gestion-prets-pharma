package com.cliniSys.gestionprets.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cliniSys.gestionprets.entity.BonDePret;
import com.cliniSys.gestionprets.service.BonDePretService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bonDePret")
@RequiredArgsConstructor

public class BonDePretController {
	private final BonDePretService bonService;

    @GetMapping
    public ResponseEntity<List<BonDePret>> getAllBon() {
        return ResponseEntity.ok(bonService.getAll());
    }

    @GetMapping("/{numBon}")
    public ResponseEntity<BonDePret> getBonById(@PathVariable String numBon) {
        return ResponseEntity.ok(bonService.getById(numBon));
    }

    @PostMapping
    public ResponseEntity<BonDePret> createBon(@RequestBody BonDePret bon) {
        return ResponseEntity.ok(bonService.createBonDePret(bon));
    }

    @DeleteMapping("/{numBon}")
    public ResponseEntity<Void> deleteBon(@PathVariable String numBon) {
        bonService.delete(numBon);
        return ResponseEntity.noContent().build();
    }

}
