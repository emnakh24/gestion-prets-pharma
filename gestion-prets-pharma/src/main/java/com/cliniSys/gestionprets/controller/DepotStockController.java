package com.cliniSys.gestionprets.controller;

import com.cliniSys.gestionprets.entity.DepotStock;
import com.cliniSys.gestionprets.service.DepotStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/depot-stocks")
@RequiredArgsConstructor
public class DepotStockController {

    private final DepotStockService depotStockService;

    @GetMapping
    public ResponseEntity<List<DepotStock>> getAllStocks() {
        return ResponseEntity.ok(depotStockService.getAllStocks());
    }

    @GetMapping("/{codDepot}/{codArt}")
    public ResponseEntity<DepotStock> getStockById(@PathVariable String codDepot, @PathVariable String codArt) {
        return ResponseEntity.ok(depotStockService.getStockById(codDepot, codArt));
    }

    @GetMapping("/depot/{codDepot}")
    public ResponseEntity<List<DepotStock>> getStocksByDepot(@PathVariable String codDepot) {
        return ResponseEntity.ok(depotStockService.getStocksByDepot(codDepot));
    }

    @PostMapping
    public ResponseEntity<DepotStock> createStock(@RequestBody Map<String, Object> body) {
        String codDepot = (String) body.get("codDepot");
        String codArt = (String) body.get("codArt");
        Integer quantite = (Integer) body.get("qteStock");
        return ResponseEntity.ok(depotStockService.createStock(codDepot, codArt, quantite));
    }

    @PutMapping("/{codDepot}/{codArt}")
    public ResponseEntity<DepotStock> updateStock(
            @PathVariable String codDepot,
            @PathVariable String codArt,
            @RequestBody Map<String, Object> body) {
        Integer quantite = (Integer) body.get("qteStock");
        return ResponseEntity.ok(depotStockService.updateStock(codDepot, codArt, quantite));
    }

    @DeleteMapping("/{codDepot}/{codArt}")
    public ResponseEntity<Void> deleteStock(@PathVariable String codDepot, @PathVariable String codArt) {
        depotStockService.deleteStock(codDepot, codArt);
        return ResponseEntity.noContent().build();
    }
}