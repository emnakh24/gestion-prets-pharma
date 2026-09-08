package com.cliniSys.gestionprets.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cliniSys.gestionprets.entity.Etablissement;
import com.cliniSys.gestionprets.exception.ArticleAlreadyExistsException;
import com.cliniSys.gestionprets.repository.EtablissementRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class EtablissementService {
	@Autowired
	private EtablissementRepository etablissementRepository;
	//--------------------------------------------------------------
	public List<Etablissement> getAllEtablissements(){
		return etablissementRepository.findAll();
	}
	//--------------------------------------------------------------
	public Etablissement getEtablissementById(String codetab) {
		//optional
		return etablissementRepository.findById(codetab)
				.orElseThrow(() -> new RuntimeException("Établissement non trouvé avec le code : " + codetab));
	}
	//--------------------------------------------------------------
	public Etablissement createEtablissement(Etablissement etablissement) {
	    if (etablissementRepository.existsById(etablissement.getCodEtab())) {

	        throw new ArticleAlreadyExistsException(
	            "L'établissement avec le code "
	            + etablissement.getCodEtab()
	            + " existe déjà."
	        );
	    }
	    return etablissementRepository.save(etablissement);
	}
	//--------------------------------------------------------------
	public Etablissement updateEtablissement(Etablissement e,String codetab) {
		Etablissement et=getEtablissementById(codetab);
		//modification de l'objet en memoire
		et.setDesignation(e.getDesignation());
		et.setAdresse(e.getAdresse());
		et.setTel(e.getTel());
		//Ici, ré-attache l'objet (via merge()) et force 
		//la synchronisation avec la base, car l'objet est 
		//"detached" entre les deux appels
		etablissementRepository.save(et);
		return et;
	}
	//--------------------------------------------------------------
	public void deleteEtablissement(String codEtab) {
        Etablissement etablissement = getEtablissementById(codEtab);
        etablissementRepository.delete(etablissement);
    }
	//--------------------------------------------------------------
}
