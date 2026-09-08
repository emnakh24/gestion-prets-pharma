package com.cliniSys.gestionprets.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id")
@Table(name = "ligneBon")
@AllArgsConstructor
@NoArgsConstructor
public class MvtstoPerEmp {

    @EmbeddedId
    private LigneBonId id;

    @ManyToOne
    @MapsId("numBon")
    @JoinColumn(name = "num_bon", nullable = false)
    @JsonIgnore
    private BonDePret bonPret;

    @ManyToOne
    @MapsId("codArt")
    @JoinColumn(name = "cod_art", nullable = false)
    private Article article;

    @Column(name = "qte_prete", nullable = false)
    private Integer qtePrete;
}
