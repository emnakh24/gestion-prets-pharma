package com.cliniSys.gestionprets.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.entity.BonDePret;

public interface BonDePretRepository extends JpaRepository<BonDePret, String>{

}
