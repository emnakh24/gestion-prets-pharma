package com.cliniSys.gestionprets.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "depot_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepotStock {

    @EmbeddedId
    private StockDepotId id;

    @ManyToOne
    @MapsId("codDepot")
    @JoinColumn(name = "cod_depot", nullable = false)
    private Depot depot; 

    @ManyToOne
    @MapsId("codArt")
    @JoinColumn(name = "cod_art", nullable = false)
    private Article article;

    @Column(name = "qte_stock", nullable = false)
    private Integer qteStock;
}