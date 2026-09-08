package com.cliniSys.gestionprets.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cliniSys.gestionprets.entity.BonDePret;
import com.cliniSys.gestionprets.entity.DepotStock;
import com.cliniSys.gestionprets.entity.StockDepotId;
import com.cliniSys.gestionprets.exception.ArticleAlreadyExistsException;
import com.cliniSys.gestionprets.entity.LigneBonId;
import com.cliniSys.gestionprets.entity.MvtstoPerEmp;
import com.cliniSys.gestionprets.repository.BonDePretRepository;
import com.cliniSys.gestionprets.repository.DepotStockRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BonDePretService {

    private final BonDePretRepository bonDePretRepository;
    private final DepotStockRepository depotStockRepository;

    public List<BonDePret> getAll() {
        return bonDePretRepository.findAll();
    }

    public BonDePret getById(String numBon) {
        return bonDePretRepository.findById(numBon)
                .orElseThrow(() -> new RuntimeException(
                        "Bon de prêt introuvable : " + numBon));
    }

    //-------------------------------------------------------------------
    /*@Transactional
    public BonDePret createBonDePret(BonDePret bonDePret) {
        List<MvtstoPerEmp> lignesRecues = new ArrayList<>(bonDePret.getLignes());
        bonDePret.setLignes(new ArrayList<>());

        String codDepot = bonDePret.getDepot().getCodDepot();

        // ÉTAPE 1 : Vérification du stock disponible pour CHAQUE ligne, AVANT toute modification
        for (MvtstoPerEmp ligne : lignesRecues) {
            String codArt = ligne.getArticle().getCodArt();
            Integer qteDemandee = ligne.getQtePrete();

            StockDepotId stockId = new StockDepotId(codDepot, codArt);
            DepotStock stock = depotStockRepository.findById(stockId)
                    .orElseThrow(() -> new RuntimeException(
                            "Aucun stock trouvé pour l'article " + codArt + " dans le dépôt " + codDepot));

            if (stock.getQteStock() < qteDemandee) {
                throw new RuntimeException(
                        "Stock insuffisant pour l'article " + codArt +
                        " (disponible : " + stock.getQteStock() + ", demandé : " + qteDemandee + ")");
            }
        }

        // ÉTAPE 2 : Si toutes les vérifications passent, on décrémente le stock et on construit les lignes
        for (MvtstoPerEmp ligne : lignesRecues) {
            String codArt = ligne.getArticle().getCodArt();
            Integer qteDemandee = ligne.getQtePrete();

            StockDepotId stockId = new StockDepotId(codDepot, codArt);
            DepotStock stock = depotStockRepository.findById(stockId)
                    .orElseThrow(() -> new RuntimeException("Stock introuvable"));

            stock.setQteStock(stock.getQteStock() - qteDemandee);
            depotStockRepository.save(stock);

            LigneBonId id = new LigneBonId(bonDePret.getNumBon(), codArt);
            ligne.setId(id);
            bonDePret.addLigne(ligne);
        }

        return bonDePretRepository.save(bonDePret);
    }*/

    //--------------------------------------------------------------------
    public void delete(String numBon) {
        bonDePretRepository.deleteById(numBon);
    }
    //--------------------------------------------------------------------
    @Transactional
    public BonDePret createBonDePret(BonDePret bonDePret) {
        if (bonDePretRepository.existsById(bonDePret.getNumBon())) {

            throw new ArticleAlreadyExistsException(
                "Le bon de prêt numéro "
                + bonDePret.getNumBon()
                + " existe déjà."
            );
        }
        List<MvtstoPerEmp> lignesRecues =
                new ArrayList<>(bonDePret.getLignes());

        bonDePret.setLignes(new ArrayList<>());

        String codDepot =
                bonDePret.getDepot().getCodDepot();

        for (MvtstoPerEmp ligne : lignesRecues) {

            String codArt =
                    ligne.getArticle().getCodArt();

            Integer qteDemandee =
                    ligne.getQtePrete();


            // Vérification quantité
            if (qteDemandee == null || qteDemandee <= 0) {

                throw new RuntimeException(
                    "La quantité demandée pour l'article "
                    + codArt
                    + " doit être supérieure à zéro."
                );
            }


            // Recherche du stock
            StockDepotId stockId =
                    new StockDepotId(codDepot, codArt);

            DepotStock stock =
                    depotStockRepository.findById(stockId)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "Aucun stock trouvé pour l'article "
                            + codArt
                            + " dans le dépôt "
                            + codDepot
                        )
                    );


            // Vérification du stock disponible
            if (stock.getQteStock() < qteDemandee) {
                throw new RuntimeException(
                    "Stock insuffisant pour l'article "
                    + codArt
                    + " (disponible : "
                    + stock.getQteStock()
                    + ", demandé : "
                    + qteDemandee
                    + ")"
                );
            }
        }
        for (MvtstoPerEmp ligne : lignesRecues) {

            String codArt =
                    ligne.getArticle().getCodArt();

            Integer qteDemandee =
                    ligne.getQtePrete();


            StockDepotId stockId =
                    new StockDepotId(codDepot, codArt);

            DepotStock stock =
                    depotStockRepository.findById(stockId)
                    .orElseThrow(() ->
                        new RuntimeException(
                            "Stock introuvable"
                        )
                    );


            // Décrémentation du stock
            stock.setQteStock(
                stock.getQteStock() - qteDemandee
            );

            depotStockRepository.save(stock);

            LigneBonId id =
                    new LigneBonId(
                        bonDePret.getNumBon(),
                        codArt
                    );

            ligne.setId(id);


            // Association ligne -> bon
            bonDePret.addLigne(ligne);
        }

        return bonDePretRepository.save(bonDePret);
    }
}