package com.cliniSys.gestionprets.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "codArt")
@Table(name = "article")

public class Article {
	@Id
	private String codArt;
	
	@Column(nullable = false,length = 200)
	private String description;
	
	private Double prixUnitaire;
	//un article peut exister dans plusieurs depot de quantite !=
	@OneToMany(mappedBy = "article")
	@JsonIgnore
    private List<DepotStock> stocks = new ArrayList<>();

	//un article peut exister dans plusieurs lignes de bon 
    @OneToMany(mappedBy = "article")
    @JsonIgnore
    private List<MvtstoPerEmp> lignesBon = new ArrayList<>();
    
	//------------------------------------------------
    public void addLigne(MvtstoPerEmp ligne) {
        if (ligne != null) {
            lignesBon.add(ligne);
            ligne.setArticle(this);
        }
    }
    //------------------------------------------------
    public void removeLigne(MvtstoPerEmp ligne) {
        if (ligne != null) {
            lignesBon.remove(ligne);

            if (ligne.getArticle() == this) {
                ligne.setArticle(null);
            }
        }
    }
    //-----------------------------------------------
    public void setLignesBon(List<MvtstoPerEmp> lignes) {

        for (MvtstoPerEmp ligne : this.lignesBon) {
            if (ligne != null && ligne.getArticle() == this) {
                ligne.setArticle(null);
            }
        }

        this.lignesBon.clear();

        if (lignes != null) {
            for (MvtstoPerEmp ligne : lignes) {
                if (ligne != null) {
                    this.lignesBon.add(ligne);
                    ligne.setArticle(this);
                }
            }
        }
    }
	//----------------------------------------------
	public void addStock(DepotStock stock) {
	    if (stock != null) {
	        stocks.add(stock);
	        stock.setArticle(this);
	    }
	}
	//----------------------------------------------
	public void removeStock(DepotStock stock) {
	    if (stock != null) {
	        stocks.remove(stock);

	        if (stock.getArticle() == this) {
	            stock.setArticle(null);
	        }
	    }
	}
	//------------------------------------------------
	public void setStocks(List<DepotStock> stocks) {

	    for (DepotStock stock : this.stocks) {
	        if (stock != null && stock.getArticle() == this) {
	            stock.setArticle(null);
	        }
	    }

	    this.stocks.clear();

	    if (stocks != null) {
	        for (DepotStock stock : stocks) {
	            if (stock != null) {
	                this.stocks.add(stock);
	                stock.setArticle(this);
	            }
	        }
	    }
	}
	//------------------------------------------------
}
