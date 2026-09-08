package com.cliniSys.gestionprets.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cliniSys.gestionprets.entity.Article;

public interface ArticleRepository extends JpaRepository<Article, String>{

}
