package com.cliniSys.gestionprets.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.entity.LigneBonId;
import com.cliniSys.gestionprets.entity.MvtstoPerEmp;
import com.cliniSys.gestionprets.repository.LigneBonRepository;

import lombok.RequiredArgsConstructor;

@Service

public class LigneBonService {
	@Autowired
	private  LigneBonRepository mvtstoPerEmpRepository;

    public List<MvtstoPerEmp> getAll() {
        return mvtstoPerEmpRepository.findAll();
    }

    public MvtstoPerEmp getById(LigneBonId id) {
        return mvtstoPerEmpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Ligne de bon introuvable"));
    }

    public MvtstoPerEmp save(MvtstoPerEmp ligne) {
        return mvtstoPerEmpRepository.save(ligne);
    }

    public void delete(LigneBonId id) {
        mvtstoPerEmpRepository.deleteById(id);
    }

}
