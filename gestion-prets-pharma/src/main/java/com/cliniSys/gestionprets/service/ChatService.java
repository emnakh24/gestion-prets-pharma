package com.cliniSys.gestionprets.service;

import com.cliniSys.gestionprets.ai.GroqService;
import com.cliniSys.gestionprets.entity.*;
import com.cliniSys.gestionprets.repository.*;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GroqService groqService;

    private final EtablissementRepository etablissementRepository;
    private final ArticleRepository articleRepository;
    private final DepotRepository depotRepository;
    private final DepotStockRepository depotStockRepository;
    private final BonDePretRepository bonDePretRepository;

    private final ArticleService articleService;
    private final DepotService depotService;
    private final DepotStockService depotStockService;
    private final BonDePretService bonDePretService;
    private final EtablissementService etablissementService;


    private final ObjectMapper objectMapper = new ObjectMapper();

    // =====================================================
    // Point d'entrée principal appelé par ChatController
    // =====================================================
    public String repondre(String messageUtilisateur) {
        String contexte = construireContexte();

        String systemPrompt = """
                Tu es l'assistant virtuel de l'application de gestion des prêts pharmaceutiques inter-établissements.
                Réponds UNIQUEMENT à partir des données ci-dessous pour les questions de consultation.
                Si l'information n'est pas présente, dis-le honnêtement, n'invente JAMAIS une donnée.
                Tu disposes aussi d'outils pour créer des articles, dépôts, stocks ou bons de prêt si l'utilisateur le demande explicitement.
                N'utilise un outil de création QUE si l'utilisateur demande clairement une création, jamais pour une simple question.
                Réponds toujours en français, de façon claire et concise.

                DONNÉES ACTUELLES DE L'APPLICATION :
                %s
                """.formatted(contexte);

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", messageUtilisateur));

        List<Map<String, Object>> tools = construireOutils();

        JsonNode messageAssistant = groqService.appelerChat(messages, tools);

        if (messageAssistant == null) {
            return "Désolé, une erreur est survenue lors de la communication avec l'assistant.";
        }

        JsonNode toolCalls = messageAssistant.path("tool_calls");

        // Cas simple : pas d'appel d'outil, réponse directe
        if (!toolCalls.isArray() || toolCalls.isEmpty()) {
            return messageAssistant.path("content").asText();
        }

        // Cas avec appel(s) d'outil : on exécute, puis on redemande une réponse finale
        Map<String, Object> messageAssistantPourHistorique = new HashMap<>();
        messageAssistantPourHistorique.put("role", "assistant");
        messageAssistantPourHistorique.put("content", messageAssistant.path("content").asText(""));
        messageAssistantPourHistorique.put("tool_calls", objectMapper.convertValue(toolCalls, Object.class));
        messages.add(messageAssistantPourHistorique);

        for (JsonNode toolCall : toolCalls) {
            String toolCallId = toolCall.path("id").asText();
            String nomFonction = toolCall.path("function").path("name").asText();
            String argumentsJson = toolCall.path("function").path("arguments").asText();

            String resultat = executerOutil(nomFonction, argumentsJson);

            Map<String, Object> toolMessage = new HashMap<>();
            toolMessage.put("role", "tool");
            toolMessage.put("tool_call_id", toolCallId);
            toolMessage.put("content", resultat);
            messages.add(toolMessage);
        }

        JsonNode reponseFinale = groqService.appelerChat(messages, null);
        return reponseFinale != null
                ? reponseFinale.path("content").asText()
                : "Action effectuée, mais impossible de formuler une confirmation.";
    }

    // =====================================================
    // Construit le contexte texte à partir des vraies données (RAG)
    // =====================================================
    private String construireContexte() {
        StringBuilder sb = new StringBuilder();

        List<Etablissement> etablissements = etablissementRepository.findAll();
        sb.append("ÉTABLISSEMENTS (").append(etablissements.size()).append(") :\n");
        etablissements.forEach(e -> sb.append("- ")
                .append(e.getCodEtab()).append(" : ")
                .append(e.getDesignation()).append(", ")
                .append(e.getAdresse()).append("\n"));

        List<Article> articles = articleRepository.findAll();
        sb.append("\nARTICLES (").append(articles.size()).append(") :\n");
        articles.forEach(a -> sb.append("- ")
                .append(a.getCodArt()).append(" : ")
                .append(a.getDescription()).append("\n"));

        List<Depot> depots = depotRepository.findAll();
        sb.append("\nDÉPÔTS (").append(depots.size()).append(") :\n");
        depots.forEach(d -> sb.append("- ")
                .append(d.getCodDepot()).append(" : ")
                .append(d.getDesignation()).append("\n"));

        List<DepotStock> stocks = depotStockRepository.findAll();
        sb.append("\nSTOCKS DISPONIBLES :\n");
        stocks.forEach(s -> sb.append("- Article ")
                .append(s.getArticle().getCodArt())
                .append(" dans dépôt ").append(s.getDepot().getDesignation())
                .append(" : ").append(s.getQteStock()).append(" unité(s)\n"));

        List<BonDePret> bons = bonDePretRepository.findAll();
        sb.append("\nBONS DE PRÊT (").append(bons.size()).append(") :\n");
        bons.forEach(bon -> {
            sb.append("- Bon ").append(bon.getNumBon())
              .append(" du ").append(bon.getDateBon())
              .append(", établissement : ").append(bon.getEtablissement().getDesignation())
              .append(", dépôt : ").append(bon.getDepot().getDesignation())
              .append("\n");
            bon.getLignes().forEach(ligne ->
                    sb.append("    • ").append(ligne.getArticle().getDescription())
                      .append(" (").append(ligne.getArticle().getCodArt()).append(") x")
                      .append(ligne.getQtePrete()).append("\n")
            );
        });

        return sb.toString();
    }

    // =====================================================
    // Exécute réellement l'action demandée par l'IA
    // =====================================================
    private String executerOutil(String nomFonction, String argumentsJson) {
        try {
            JsonNode args = objectMapper.readTree(argumentsJson);

            switch (nomFonction) {
                case "creerArticle": {
                    Article article = new Article();
                    article.setCodArt(args.path("codArt").asString());
                    article.setDescription(args.path("description").asString());
                    if (args.has("prixUnitaire")) {
                        article.setPrixUnitaire(args.path("prixUnitaire").asDouble());
                    }
                    articleService.createArticle(article);
                    return "Article " + article.getCodArt() + " créé avec succès.";
                }

                case "creerDepot": {
                    Depot depot = new Depot();
                    depot.setCodDepot(args.path("codDepot").asString());
                    depot.setDesignation(args.path("designation").asString());
                    depot.setAdresse(args.path("adresse").asString());
                    depotService.save(depot);
                    return "Dépôt " + depot.getCodDepot() + " créé avec succès.";
                }
                case "creerEtablissement": {
                    Etablissement etab = new Etablissement();
                    etab.setCodEtab(args.path("codEtab").asString());
                    etab.setDesignation(args.path("designation").asString());
                    etab.setAdresse(args.path("adresse").asString());
                    etab.setTel(args.path("tel").asString());
                    etablissementService.createEtablissement(etab);
                    return "Etablissement " + etab.getCodEtab() + " créé avec succès.";
                }

                case "creerStockDepot": {
                    String codDepot = args.path("codDepot").asString();
                    String codArt = args.path("codArt").asString();
                    Integer quantite = args.path("qteStock").asInt();
                    depotStockService.createStock(codDepot, codArt, quantite);
                    return "Stock créé : " + quantite + " unité(s) de " + codArt + " dans " + codDepot + ".";
                }

                case "creerBonDePret": {
                    BonDePret bon = new BonDePret();
                    bon.setNumBon(args.path("numBon").asString());
                    bon.setDateBon(LocalDate.parse(args.path("dateBon").asString()));

                    Depot depot = new Depot();
                    depot.setCodDepot(args.path("codDepot").asString());
                    bon.setDepot(depot);

                    Etablissement etab = new Etablissement();
                    etab.setCodEtab(args.path("codEtab").asString());
                    bon.setEtablissement(etab);

                    List<MvtstoPerEmp> lignes = new ArrayList<>();
                    for (JsonNode ligneNode : args.path("lignes")) {
                        MvtstoPerEmp ligne = new MvtstoPerEmp();
                        Article article = new Article();
                        article.setCodArt(ligneNode.path("codArt").asString());
                        ligne.setArticle(article);
                        ligne.setQtePrete(ligneNode.path("qtePrete").asInt());
                        lignes.add(ligne);
                    }
                    bon.setLignes(lignes);

                    bonDePretService.createBonDePret(bon);
                    return "Bon de prêt " + bon.getNumBon() + " créé avec succès (" + lignes.size() + " article(s)).";
                }

                default:
                    return "Fonction inconnue : " + nomFonction;
            }
        } catch (Exception e) {
            return "Erreur lors de l'exécution : " + e.getMessage();
        }
    }

    // =====================================================
    // Décrit les outils disponibles pour l'IA (format function calling)
    // =====================================================
    private List<Map<String, Object>> construireOutils() {
        List<Map<String, Object>> tools = new ArrayList<>();

        tools.add(creerOutil("creerArticle", "Créer un nouvel article pharmaceutique",
                Map.of(
                        "codArt", champ("string", "Code unique de l'article"),
                        "description", champ("string", "Description de l'article"),
                        "prixUnitaire", champ("number", "Prix unitaire (optionnel)")
                ),
                List.of("codArt", "description")
        ));
        
        tools.add(creerOutil("creerEtablissement", "Créer une nouvelle etablissement",
                Map.of(
                        "codEtab", champ("string", "Code unique de l'etablissement"),
                        "designation", champ("string", "designation de l'etablissement"),
                        "adresse", champ("string", "adresse (optionnel)"),
                        "telephone",champ("string","telephone")
                ),
                List.of("codEtab", "designation")
        ));

        tools.add(creerOutil("creerDepot", "Créer un nouveau dépôt",
                Map.of(
                        "codDepot", champ("string", "Code unique du dépôt"),
                        "designation", champ("string", "Nom du dépôt"),
                        "adresse", champ("string", "Adresse du dépôt")
                ),
                List.of("codDepot", "designation", "adresse")
        ));

        tools.add(creerOutil("creerStockDepot", "Créer ou définir le stock d'un article dans un dépôt",
                Map.of(
                        "codDepot", champ("string", "Code du dépôt"),
                        "codArt", champ("string", "Code de l'article"),
                        "qteStock", champ("integer", "Quantité en stock")
                ),
                List.of("codDepot", "codArt", "qteStock")
        ));

        tools.add(creerOutil("creerBonDePret", "Créer un nouveau bon de prêt avec ses lignes d'articles",
                Map.of(
                        "numBon", champ("string", "Numéro unique du bon"),
                        "dateBon", champ("string", "Date au format AAAA-MM-JJ"),
                        "codDepot", champ("string", "Code du dépôt source"),
                        "codEtab", champ("string", "Code de l'établissement bénéficiaire"),
                        "lignes", Map.of(
                                "type", "array",
                                "description", "Liste des articles prêtés",
                                "items", Map.of(
                                        "type", "object",
                                        "properties", Map.of(
                                                "codArt", champ("string", "Code de l'article"),
                                                "qtePrete", champ("integer", "Quantité prêtée")
                                        ),
                                        "required", List.of("codArt", "qtePrete")
                                )
                        )
                ),
                List.of("numBon", "dateBon", "codDepot", "codEtab", "lignes")
        ));

        return tools;
    }

    private Map<String, Object> champ(String type, String description) {
        return Map.of("type", type, "description", description);
    }

    private Map<String, Object> creerOutil(String nom, String description, Map<String, Object> proprietes, List<String> requis) {
        return Map.of(
                "type", "function",
                "function", Map.of(
                        "name", nom,
                        "description", description,
                        "parameters", Map.of(
                                "type", "object",
                                "properties", proprietes,
                                "required", requis
                        )
                )
        );
    }
}