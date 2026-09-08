package com.cliniSys.gestionprets.exception;

public class StockAlreadyUsedException extends RuntimeException {
	public StockAlreadyUsedException(String message) {
        super(message);
    }

}
