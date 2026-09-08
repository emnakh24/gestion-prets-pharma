package com.cliniSys.gestionprets.service;

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.entity.Depot;
import com.cliniSys.gestionprets.entity.DepotStock;
import com.cliniSys.gestionprets.entity.StockDepotId;
import com.cliniSys.gestionprets.exception.ArticleAlreadyExistsException;
import com.cliniSys.gestionprets.exception.StockAlreadyUsedException;
import com.cliniSys.gestionprets.repository.ArticleRepository;
import com.cliniSys.gestionprets.repository.DepotRepository;
import com.cliniSys.gestionprets.repository.DepotStockRepository;
import com.cliniSys.gestionprets.repository.LigneBonRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepotStockService {
    private final DepotStockRepository depotStockRepository;
    private final DepotRepository depotRepository;
    private final ArticleRepository articleRepository;
    private final LigneBonRepository ligneBonRepository;
    //----------------------------------------------------------------------------
    public List<DepotStock> getAllStocks() {
        return depotStockRepository.findAll();
    }
    //-----------------------------------------------------------------------------
    public DepotStock getStockById(String codDepot, String codArt) {
        StockDepotId id = new StockDepotId(codDepot, codArt);
        return depotStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Stock introuvable pour le dépôt " + codDepot + " et l'article " + codArt));
    }
    //-----------------------------------------------------------------------------
    public List<DepotStock> getStocksByDepot(String codDepot) {
        return depotStockRepository.findByDepot_CodDepot(codDepot);
    }
    //-----------------------------------------------------------------------------
    @Transactional
    public DepotStock createStock(String codDepot, String codArt, Integer quantite) {
        Depot depot = depotRepository.findById(codDepot)
                .orElseThrow(() ->
                    new RuntimeException("Dépôt introuvable : " + codDepot)
                );
        Article article = articleRepository.findById(codArt)
                .orElseThrow(() ->
                    new RuntimeException("Article introuvable : " + codArt)
                );
        StockDepotId id = new StockDepotId(codDepot, codArt);
        // Vérification de la clé primaire composée
        if (depotStockRepository.existsById(id)) {
            throw new ArticleAlreadyExistsException(
                "Le stock de l'article " + codArt +
                " existe déjà dans le dépôt " + codDepot
            );
        }
        DepotStock stock = new DepotStock();
        stock.setId(id);
        stock.setDepot(depot);
        stock.setArticle(article);
        stock.setQteStock(quantite);

        return depotStockRepository.save(stock);
    }
    //-----------------------------------------------------------------------------
    @Transactional
    public DepotStock updateStock(String codDepot, String codArt, Integer nouvelleQuantite) {
        DepotStock stock = getStockById(codDepot, codArt);
        stock.setQteStock(nouvelleQuantite);
        return depotStockRepository.save(stock);
    }
    //----------------------------------------------------------------------------
    @Transactional
    public void deleteStock(String codDepot, String codArt) {
    	StockDepotId id = new StockDepotId(codDepot, codArt);

        DepotStock stock = depotStockRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Stock introuvable")
                );
        // Vérifier si le stock est utilisé dans un bon de prêt
        boolean utiliseDansBon =
                ligneBonRepository.existsByArticle_CodArtAndBonPret_Depot_CodDepot(codArt,codDepot);
        if (utiliseDansBon) {
            throw new StockAlreadyUsedException(
                "Impossible de supprimer ce stock car il est déjà utilisé dans un bon de prêt."
            );
        }
        // Suppression seulement s'il n'est pas utilisé
        depotStockRepository.delete(stock);
    }
}