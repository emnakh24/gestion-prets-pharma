package com.cliniSys.gestionprets.controller;

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    //-----------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }
    //-----------------------------------------------------------------
    @GetMapping("/{codArt}")
    public ResponseEntity<Article> getArticleById(@PathVariable String codArt) {
        return ResponseEntity.ok(articleService.getArticleById(codArt));
    }
    //-----------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        return ResponseEntity.ok(articleService.createArticle(article));
    }    
    //-----------------------------------------------------------------
    @PutMapping("/{codArt}")
    public ResponseEntity<Article> updateArticle(@PathVariable String codArt, @RequestBody Article article) {
        return ResponseEntity.ok(articleService.updateArticle(codArt, article));
    }
    //-----------------------------------------------------------------
    @DeleteMapping("/{codArt}")
    public ResponseEntity<Void> deleteArticle(@PathVariable String codArt) {
        articleService.deleteArticle(codArt);
        return ResponseEntity.noContent().build();
    }
}