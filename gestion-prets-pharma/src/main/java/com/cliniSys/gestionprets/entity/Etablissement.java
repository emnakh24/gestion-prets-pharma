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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etablissement")

public class Etablissement {
	@Id
	private String codEtab ;
	
	@Column(nullable = false, length = 200)
	private String designation;
	
	@Column(nullable = false, length = 150)
	private String adresse;
	
	@Column(length = 20)
	private String tel;
	
	@OneToMany(mappedBy = "etablissement")
	@JsonIgnore
	private List<BonDePret> bonsPret = new ArrayList();
	//--------------------------------------------------
	public void addBonPret(BonDePret bon) {
        if (bon != null) {
            bonsPret.add(bon);
            bon.setEtablissement(this);
        }
    }

    //----------------------------------------------
    public void removeBonPret(BonDePret bon) {
        if (bon != null) {
            bonsPret.remove(bon);
            if (bon.getEtablissement() == this) {
                bon.setEtablissement(null);
            }
        }
    }

    //----------------------------------------------
    public void setBonsPret(List<BonDePret> bons) {
        for (BonDePret bon : this.bonsPret) {
            if (bon != null && bon.getEtablissement() == this) {
                bon.setEtablissement(null);
            }
        }
        this.bonsPret.clear();
        if (bons != null) {
            for (BonDePret bon : bons) {
                if (bon != null) {
                    this.bonsPret.add(bon);
                    bon.setEtablissement(this);
                }
            }
        }
    }
    //-----------------------------------------------
}
