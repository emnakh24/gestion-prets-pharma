package com.cliniSys.gestionprets.service;

import com.cliniSys.gestionprets.entity.Article;
import com.cliniSys.gestionprets.exception.ArticleAlreadyExistsException;
import com.cliniSys.gestionprets.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    //----------------------------------------------------------------------
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }
    //----------------------------------------------------------------------
    public Article getArticleById(String codArt) {
        return articleRepository.findById(codArt)
                .orElseThrow(() -> new RuntimeException("Article non trouvé avec le code : " + codArt));
    }
    //---------------------------------------------------------------------
    public Article createArticle(Article article) {
    	 if (articleRepository.existsById(article.getCodArt())) {
    	        throw new ArticleAlreadyExistsException(
    	            "Le code article " + article.getCodArt() + " existe déjà."
    	        );
    	    }

    	    return articleRepository.save(article);
    }
    //---------------------------------------------------------------------
    @Transactional
    public Article updateArticle(String codArt, Article articleDetails) {
        Article article = getArticleById(codArt);
        article.setDescription(articleDetails.getDescription());
        article.setPrixUnitaire(articleDetails.getPrixUnitaire());
        return articleRepository.save(article);
    }
    //----------------------------------------------------------------------
    @Transactional
    public void deleteArticle(String codArt) {
        Article article = getArticleById(codArt);
        articleRepository.delete(article);
    }
}