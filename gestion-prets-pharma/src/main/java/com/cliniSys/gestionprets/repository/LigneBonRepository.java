package com.cliniSys.gestionprets.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cliniSys.gestionprets.entity.LigneBonId;
import com.cliniSys.gestionprets.entity.MvtstoPerEmp;

public interface LigneBonRepository  extends JpaRepository<MvtstoPerEmp, LigneBonId> {

	boolean existsByArticle_CodArtAndBonPret_Depot_CodDepot(String codArt,String codDepot);

}
