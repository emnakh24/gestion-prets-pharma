package com.cliniSys.gestionprets.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cliniSys.gestionprets.entity.Etablissement;
import com.cliniSys.gestionprets.service.EtablissementService;

//grace a elle tout ce qui est retourne est traduit en JSON
@RestController
//Définit le préfixe commun de toutes les routes de cette classe
@RequestMapping("/api/etablissements")

public class EtablissementController {
	@Autowired
	private EtablissementService etablissementService;
	//--------------------------------------------------------
	@GetMapping//GET recuperer
	//le type de retour. ResponseEntity permet de contrôler précisément la réponse HTTP (code de statut, en-têtes, corps)
	public ResponseEntity<List<Etablissement>>getAllEtablissements(){
		return ResponseEntity.ok(etablissementService.getAllEtablissements());
	}
	//requete http correspondante 
	//GET http://localhost:8080/api/etablissements
	//--------------------------------------------------------
    @GetMapping("/{codetab}")//he4ia kmela lil chemin /api/etablissements
    //GET /api/etablissements/{codetab}
	public ResponseEntity<Etablissement>getEtablissementById(@PathVariable String codetab){
        return ResponseEntity.ok(etablissementService.getEtablissementById(codetab));
    }
    //--------------------------------------------------------
    @PostMapping//POST c'est une creation 
    //@RequestBody prend le corps de la requete et le convertit automatiquement a un objet java Etablissement 
    public ResponseEntity<Etablissement> createEtablissement(@RequestBody Etablissement etablissement) {
        return ResponseEntity.ok(etablissementService.createEtablissement(etablissement));
    }
    //--------------------------------------------------------
    @PutMapping("/{codEtab}")//PUT modification
    //PUT /api/etablissements/{codEtab}
    //Combine @PathVariable (le code dans l'URL, qui identifie quel établissement modifier) et @RequestBody (les nouvelles données à appliquer)
    //*******@PathVariable dit à Spring : "prends la valeur capturée dans {codEtab} (défini dans l'URL du @GetMapping) et injecte-la dans ce paramètre de méthode".*********
    public ResponseEntity<Etablissement> updateEtablissement(@PathVariable String codEtab, @RequestBody Etablissement etablissement) {
        return ResponseEntity.ok(etablissementService.updateEtablissement(etablissement,codEtab));
    }
    //--------------------------------------------------------
    @DeleteMapping("/{codEtab}")
    //DELETE /api/etablissements/{codEtab}
    public ResponseEntity<Void> deleteEtablissement(@PathVariable String codEtab) {
        etablissementService.deleteEtablissement(codEtab);
        return ResponseEntity.noContent().build();
    }
    //--------------------------------------------------------
}
