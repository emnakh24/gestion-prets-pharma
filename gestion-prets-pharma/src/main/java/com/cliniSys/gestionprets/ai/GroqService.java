package com.cliniSys.gestionprets.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // =====================================================
    // Méthode simple (question -> réponse directe, sans outils)
    // Gardée pour /api/test-ai ou tout appel basique
    // =====================================================
    public String demanderReponse(String systemPrompt, String messageUtilisateur) {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", messageUtilisateur)
        );

        JsonNode messageAssistant = appelerChat(messages, null);

        if (messageAssistant == null) {
            return "Désolé, une erreur est survenue lors de la communication avec l'assistant.";
        }

        JsonNode content = messageAssistant.path("content");
        if (content.isMissingNode() || content.isNull()) {
            return "Je n'ai pas reçu de réponse valide de l'assistant.";
        }

        return content.asText();
    }

    // =====================================================
    // Méthode avec support du function calling (outils)
    // Retourne le message "assistant" complet (peut contenir tool_calls)
    // =====================================================
    public JsonNode appelerChat(List<Map<String, Object>> messages, List<Map<String, Object>> tools) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        System.out.println("=================================");
        System.out.println("MODELE GROQ UTILISE = [" + model + "]");
        System.out.println("URL GROQ = [" + apiUrl + "]");
        System.out.println("NB MESSAGES = " + messages.size());
        System.out.println("NB OUTILS = " + (tools != null ? tools.size() : 0));
        System.out.println("=================================");

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("temperature", 0.2);

        if (tools != null && !tools.isEmpty()) {
            body.put("tools", tools);
            body.put("tool_choice", "auto");
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            String response = restTemplate.postForObject(apiUrl, request, String.class);

            System.out.println("Réponse reçue de Groq :");
            System.out.println(response);

            JsonNode root = objectMapper.readTree(response);
            JsonNode message = root.path("choices").path(0).path("message");

            if (message.isMissingNode()) {
                return null;
            }

            return message;

        } catch (Exception e) {
            System.out.println("=================================");
            System.out.println("ERREUR GROQ");
            System.out.println("=================================");
            System.out.println("MODELE GROQ UTILISE = [" + model + "]");
            System.out.println("URL GROQ = [" + apiUrl + "]");
            System.out.println("API KEY PRESENTE = " + (apiKey != null && !apiKey.isBlank()));
            System.out.println("=================================");
            e.printStackTrace();
            return null;
        }
    }
}