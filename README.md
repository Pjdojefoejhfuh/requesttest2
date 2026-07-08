# Roblox Request Bot (Node.js / discord.js v14)

Bot Discord propre et minimaliste pour gérer une file de requêtes de jeux Roblox
via un **panel** avec menu déroulant.

## 🔁 Fonctionnement

1. Un membre utilise **`/request lien:https://roblox.com/games/...`** pour soumettre un jeu.
2. La requête apparaît automatiquement dans le **panel** du salon configuré
   (menu déroulant listant toutes les requêtes en attente).
3. Un autre membre choisit une requête dans le menu déroulant → elle est **claim** (prise).
   - Elle est retirée de la file.
   - Le membre reçoit un **MP** avec le lien du jeu et les instructions.
4. Une fois le travail terminé : **`/submit nom_roblox: image: ou gofile_link:`**
   → envoie une soumission dans le salon de review.
5. Si le membre ne peut pas terminer : **`/cancelrequest`** → la requête retourne
   automatiquement dans la file d'attente (visible à nouveau dans le panel).

## 📦 Commandes

| Commande | Description |
|---|---|
| `/request lien` | Soumet un lien Roblox (doit commencer par `https://roblox.com/`) |
| `/submit nom_roblox [image] [gofile_link]` | Soumet le travail pour la requête en cours (image OU lien GoFile requis) |
| `/cancelrequest` | Remet ta requête actuelle dans la file d'attente |

## 🚀 Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Remplis `DISCORD_TOKEN`, `CLIENT_ID`, et `GUILD_ID` (recommandé en dev).
   `PANEL_CHANNEL_ID` est déjà préconfiguré sur `1524417681665818775`.

3. **Déployer les commandes slash**
   ```bash
   npm run deploy
   ```

4. **Lancer le bot**
   ```bash
   npm start
   ```

Au démarrage, le bot crée (ou retrouve) automatiquement le message du panel
dans le salon configuré — aucune commande manuelle n'est nécessaire pour l'initialiser.

## ⚙️ Permissions Discord requises

Quand tu génères le lien d'invitation (OAuth2 > URL Generator), coche les scopes
`bot` + `applications.commands`, et au minimum ces permissions :
- Send Messages
- Embed Links
- Use Slash Commands
- Read Message History

Le bot doit aussi pouvoir envoyer des MP aux membres (activé par défaut, sauf si
le membre a désactivé les MP venant de membres du serveur).

## 🗂 Structure du projet

```
roblox-request-bot/
├── commands/
│   ├── request.js
│   ├── submit.js
│   └── cancelrequest.js
├── utils/
│   ├── db.js          # stockage JSON des requêtes
│   ├── roblox.js       # validation + infos jeu via l'API publique Roblox
│   └── panel.js         # construction / mise à jour du panel
├── data/
│   ├── requests.json    # (auto-généré)
│   └── panel.json        # (auto-généré)
├── config.js
├── deploy-commands.js
├── index.js
├── package.json
├── .env.example
└── README.md
```

## 💾 Stockage

Les requêtes sont stockées dans `data/requests.json` (persistant tant que
le dossier `data/` n'est pas supprimé). Aucune base de données externe requise.

> ⚠️ Ce bot n'utilise aucun cookie de compte Roblox et n'automatise aucun compte.
> Il se base uniquement sur l'API publique de Roblox, sans authentification.
