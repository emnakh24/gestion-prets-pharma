package com.cliniSys.gestionprets.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



//******c'est une classe pour transformee notre exception 
//en une reponce http comprehensible par le js **************



@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ArticleAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleArticleAlreadyExists(
            ArticleAlreadyExistsException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                    "message", ex.getMessage()
                ));
    }
    //--------------------------------------------------------------------
    @ExceptionHandler(StockAlreadyUsedException.class)
    public ResponseEntity<Map<String, String>> handleStockAlreadyUsed(
            StockAlreadyUsedException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }
}