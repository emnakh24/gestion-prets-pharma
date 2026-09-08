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

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.entity.Depot;
import com.cliniSys.gestionprets.service.ArticleService;
import com.cliniSys.gestionprets.service.DepotService;

@RestController
@RequestMapping("/api/depots")

public class DepotController {
	@Autowired
	private DepotService depotService;
	//-----------------------------------------------------------
	@GetMapping
	public ResponseEntity<List<Depot>>getAllDepot(){
		return ResponseEntity.ok(depotService.getAllDepots());
	}
	//-----------------------------------------------------------

    @GetMapping("/{codDepot}")
    public ResponseEntity<Depot> getDepotById(@PathVariable String codDepot) {
        return ResponseEntity.ok(depotService.getById(codDepot));
    }

    @PostMapping
    public ResponseEntity<Depot> createDepot(@RequestBody Depot depot) {
        return ResponseEntity.ok(depotService.save(depot));
    }

    @PutMapping("/{codDepot}")
    public ResponseEntity<Depot> updateArticle(@PathVariable String codDepot, @RequestBody Depot depot) {
        return ResponseEntity.ok(depotService.update(codDepot, depot));
    }

    @DeleteMapping("/{codDepot}")
    public ResponseEntity<Void> deleteDepot(@PathVariable String codDepot) {
    	depotService.delete(codDepot);
        return ResponseEntity.noContent().build();
    }
}
