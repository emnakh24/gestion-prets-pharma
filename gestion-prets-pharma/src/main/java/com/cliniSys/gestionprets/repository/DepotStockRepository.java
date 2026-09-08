package com.cliniSys.gestionprets.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cliniSys.gestionprets.entity.DepotStock;
import com.cliniSys.gestionprets.entity.StockDepotId;

public interface DepotStockRepository extends JpaRepository <DepotStock, StockDepotId>  {
	//recuperer les articles d'un depot
	List<DepotStock> findByDepot_CodDepot(String codDepot);
}
