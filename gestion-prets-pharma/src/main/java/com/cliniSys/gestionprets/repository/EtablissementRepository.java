package com.cliniSys.gestionprets.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cliniSys.gestionprets.entity.Etablissement;

public interface EtablissementRepository extends JpaRepository<Etablissement, String>{
//he4ia bech nesta3mlou grace a elle les methodes save(), findById(), findAll(), deleteById()
}
