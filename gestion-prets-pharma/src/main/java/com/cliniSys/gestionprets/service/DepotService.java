package com.cliniSys.gestionprets.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cliniSys.gestionprets.entity.Depot;
import com.cliniSys.gestionprets.exception.ArticleAlreadyExistsException;
import com.cliniSys.gestionprets.repository.DepotRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class DepotService {
	@Autowired
	private DepotRepository depotRepository;
	//--------------------------------------------
	public List<Depot> getAllDepots(){
		return depotRepository.findAll();
	}
	//--------------------------------------------
	public Depot getById(String codDepot) {
	    return depotRepository.findById(codDepot)
	                .orElseThrow(() -> new RuntimeException(
	                        "Dépôt introuvable : " + codDepot));
	}
	//--------------------------------------------
	public Depot save(Depot depot) {
	    if (depotRepository.existsById(depot.getCodDepot())) {

	        throw new ArticleAlreadyExistsException(
	            "Le dépôt avec le code "
	            + depot.getCodDepot()
	            + " existe déjà."
	        );
	    }

	    return depotRepository.save(depot);
	}
	//--------------------------------------------
	public void delete(String codDepot) {
	     depotRepository.deleteById(codDepot);
	}
	//--------------------------------------------
	public Depot update(String codDepot, Depot depotModifie) {

	    Depot depot = depotRepository.findById(codDepot)
	            .orElseThrow(() ->
	                    new RuntimeException("Dépôt introuvable : " + codDepot));

	    depot.setDesignation(depotModifie.getDesignation());
	    depot.setAdresse(depotModifie.getAdresse());

	    return depotRepository.save(depot);
	}
	//-------------------------------------------
}
