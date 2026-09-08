package com.cliniSys.gestionprets.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@ToString
@EqualsAndHashCode(of = "codDepot")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "depot")
public class Depot {

    @Id
    private String codDepot;

    @Column(nullable = false, length = 200)
    private String designation;

    @Column(nullable = false, length = 200)
    private String adresse;

    @OneToMany(mappedBy = "depot")
    @JsonIgnore
    private List<DepotStock> stocks = new ArrayList<>();

    @OneToMany(mappedBy = "depot")
    @JsonIgnore
    private List<BonDePret> bonsPret = new ArrayList<>();

    //-------------------------------------------------------
    public void addStock(DepotStock stock) {
        if (stock != null) {
            stocks.add(stock);
            stock.setDepot(this);
        }
    }
    //-------------------------------------------------------
    public void removeStock(DepotStock stock) {
        if (stock != null) {
            stocks.remove(stock);
            if (stock.getDepot() == this) {
                stock.setDepot(null);
            }
        }
    }
    //-------------------------------------------------------
    public void setStocks(List<DepotStock> stocks) {
        for (DepotStock stock : this.stocks) {
            if (stock != null && stock.getDepot() == this) {
                stock.setDepot(null);
            }
        }
        this.stocks.clear();
        if (stocks != null) {
            for (DepotStock stock : stocks) {
                if (stock != null) {
                    this.stocks.add(stock);
                    stock.setDepot(this);
                }
            }
        }
    }

    //------------------------------------------------------
    public void addBonPret(BonDePret bon) {
        if (bon != null) {
            bonsPret.add(bon);
            bon.setDepot(this);
        }
    }
    //-------------------------------------------------------
    public void removeBonPret(BonDePret bon) {
        if (bon != null) {
            bonsPret.remove(bon);
            if (bon.getDepot() == this) {
                bon.setDepot(null);
            }
        }
    }
    //------------------------------------------------------
    public void setBonsPret(List<BonDePret> bons) {
        for (BonDePret bon : this.bonsPret) {
            if (bon != null && bon.getDepot() == this) {
                bon.setDepot(null);
            }
        }
        this.bonsPret.clear();
        if (bons != null) {
            for (BonDePret bon : bons) {
                if (bon != null) {
                    this.bonsPret.add(bon);
                    bon.setDepot(this);
                }
            }
        }
    }
}