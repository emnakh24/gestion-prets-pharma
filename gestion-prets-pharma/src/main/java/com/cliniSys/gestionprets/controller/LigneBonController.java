package com.cliniSys.gestionprets.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cliniSys.gestionprets.entity.LigneBonId;
import com.cliniSys.gestionprets.entity.MvtstoPerEmp;
import com.cliniSys.gestionprets.service.LigneBonService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lignes-bon")
@RequiredArgsConstructor
public class LigneBonController {

    private final LigneBonService mvtstoPerEmpService;

    @GetMapping
    public List<MvtstoPerEmp> getAll() {
        return mvtstoPerEmpService.getAll();
    }
    //---------------------------------------------------------
    @GetMapping("/{numBon}/{codArt}")
    public ResponseEntity<MvtstoPerEmp> getById(
            @PathVariable String numBon,
            @PathVariable String codArt) {

        LigneBonId id = new LigneBonId(numBon, codArt);

        return ResponseEntity.ok(
                mvtstoPerEmpService.getById(id)
        );
    }
    //---------------------------------------------------------
    @PostMapping
    public ResponseEntity<MvtstoPerEmp> create(
            @RequestBody MvtstoPerEmp ligne) {

        return ResponseEntity.ok(
                mvtstoPerEmpService.save(ligne)
        );
    }
    //--------------------------------------------------------
    @PutMapping("/{numBon}/{codArt}")
    public ResponseEntity<MvtstoPerEmp> modifier(
            @PathVariable String numBon,
            @PathVariable String codArt,
            @RequestBody MvtstoPerEmp ligneModifiee) {

        LigneBonId id = new LigneBonId(numBon, codArt);

        MvtstoPerEmp ligne =
                mvtstoPerEmpService.getById(id);

        ligne.setQtePrete(
                ligneModifiee.getQtePrete()
        );

        return ResponseEntity.ok(
                mvtstoPerEmpService.save(ligne)
        );
    }
    //-------------------------------------------------------
    @DeleteMapping("/{numBon}/{codArt}")
    public ResponseEntity<Void> delete(
            @PathVariable String numBon,
            @PathVariable String codArt) {

        LigneBonId id = new LigneBonId(numBon, codArt);

        mvtstoPerEmpService.delete(id);

        return ResponseEntity.noContent().build();
    }
}