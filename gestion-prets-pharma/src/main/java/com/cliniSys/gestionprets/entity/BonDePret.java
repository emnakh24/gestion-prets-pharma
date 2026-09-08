package com.cliniSys.gestionprets.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

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
@EqualsAndHashCode(of = "numBon")
@Table(name="bonDePret")
public class BonDePret {
	 	@Id
	 	@Column(length = 255)
	    private String numBon;

	    @Column(nullable = false)
	    private LocalDate dateBon;

	    @ManyToOne
	    @JoinColumn(name = "codEtab", nullable = false)
	    private Etablissement etablissement;

	    @ManyToOne
	    @JoinColumn(name = "codDepot", nullable = false)
	    private Depot depot;

	    @OneToMany(
	    	    mappedBy = "bonPret",
	    	    cascade = CascadeType.ALL,
	    	    orphanRemoval = true)
	    
	    private List<MvtstoPerEmp> lignes = new ArrayList<>();
	    //-----------------------------------------------------
	    public void addLigne(MvtstoPerEmp ligne) {
	        if (ligne != null) {
	            lignes.add(ligne);
	            ligne.setBonPret(this);
	        }
	    }
	    //----------------------------------------------
	    public void removeLigne(MvtstoPerEmp ligne) {
	        if (ligne != null) {
	            lignes.remove(ligne);
	            if (ligne.getBonPret() == this) {
	                ligne.setBonPret(null);
	            }
	        }
	    }
	    //----------------------------------------------
	    public void setLignes(List<MvtstoPerEmp> lignes) {
	        for (MvtstoPerEmp ligne : this.lignes) {
	            if (ligne != null && ligne.getBonPret() == this) {
	                ligne.setBonPret(null);
	            }
	        }
	        this.lignes.clear();
	        if (lignes != null) {
	            for (MvtstoPerEmp ligne : lignes) {
	                if (ligne != null) {
	                    this.lignes.add(ligne);
	                    ligne.setBonPret(this);
	                }
	            }
	        }
	    }
	    //---------------------------------------------
}
