#  Gestion des Prêts d'Articles Pharmaceutiques Inter-Établissements

Application de gestion des prêts d'articles pharmaceutiques entre une pharmacie centrale et des établissements bénéficiaires (cliniques, hôpitaux), développée dans le cadre d'un stage d'été chez **Clinisys**.

Le projet couvre l'ensemble du cycle : gestion des établissements et des dépôts, suivi des stocks, création de bons de prêt avec vérification automatique de la disponibilité, et un **assistant virtuel intelligent** capable de consulter et de créer des données via le langage naturel.

---

##  Fonctionnalités

- **Gestion des établissements bénéficiaires** — CRUD complet (cliniques, hôpitaux)
- **Gestion des articles pharmaceutiques** — CRUD complet
- **Gestion des dépôts** — CRUD complet
- **Gestion des stocks par dépôt** — quantités disponibles par couple dépôt/article
- **Bons de prêt** — création avec sélection dynamique des articles disponibles, consultation détaillée, historique
- **Vérification et décrémentation automatique du stock** à la création d'un bon, avec annulation complète (rollback) en cas de stock insuffisant
- **Authentification administrateur** sécurisée par JSON Web Token (JWT)
- **Assistant virtuel IA** intégré à l'application :
  - Répond aux questions sur les données réelles de l'application (établissements, stocks, bons de prêt...) grâce à un pattern **RAG** (Retrieval-Augmented Generation) — l'assistant s'appuie uniquement sur les données réelles interrogées en base, sans jamais inventer d'information
  - Peut **créer** des articles, dépôts, stocks ou bons de prêt directement depuis une conversation en langage naturel, grâce au **function calling**

---

##  Stack technique

**Backend**
- Java 21 / Spring Boot 4
- Spring Data JPA / Hibernate
- Spring Security (JWT)
- SQL Server

**Frontend**
- HTML5 / CSS3 / JavaScript natif (vanilla JS)
- Architecture par pages, sans framework — appels REST via `fetch()`

**Intelligence artificielle**
- API [Groq](https://groq.com) (modèles Llama) pour l'assistant conversationnel
- Pattern RAG scopé aux données de l'application
- Function calling pour les actions de création

---

##  Modèle de données

| Entité | Description |
|---|---|
| `Etablissement` | Clinique ou hôpital bénéficiaire d'un prêt |
| `Article` | Article pharmaceutique catalogué |
| `Depot` | Dépôt de stockage source des prêts |
| `DepotStock` | Quantité disponible d'un article dans un dépôt donné |
| `BonDePret` | Bon de prêt : établissement, dépôt, date, lignes d'articles |
| `LigneBonPret` | Ligne de détail d'un bon (article + quantité prêtée) |
| `Admin` | Compte administrateur de l'application |

---

##  Installation

### Prérequis
- Java 21+
- SQL Server
- Une clé API [Groq](https://console.groq.com) (gratuite)

### Configuration

1. Cloner le dépôt
2. Copier `application.properties.example` vers `application.properties`
3. Renseigner :
   - Les identifiants de connexion à votre base SQL Server
   - Votre clé API Groq (`groq.api.key`)
   - Une clé secrète JWT (`jwt.secret`, minimum 32 caractères)

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=votre_base
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe

groq.api.key=votre_cle_groq
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.model=llama-3.3-70b-versatile

jwt.secret=votre_cle_secrete_dau_moins_32_caracteres
```

4. Lancer l'application (`GestionPretsPharmaApplication`) — les tables sont créées automatiquement
5. Un compte administrateur par défaut est créé au premier démarrage (voir la console au lancement)
6. Ouvrir `index.html` dans un navigateur

---

##  Sécurité

- Authentification par JWT, toutes les routes API (hors connexion) sont protégées
- Mots de passe administrateur chiffrés avec BCrypt
- Aucune information sensible n'est codée en dur dans le dépôt (voir `application.properties.example`)

---

##  Contexte

Projet réalisé dans le cadre d'un stage d'été en développement Spring Boot, avec pour objectif de concevoir un module métier complet de A à Z : modélisation, backend REST, frontend, sécurité, et exploration de l'intégration d'une IA conversationnelle appliquée à un cas d'usage réel.
