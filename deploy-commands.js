const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`🚀 Déploiement de ${commands.length} commande(s) slash...`);

    let data;
    if (config.guildId) {
      // Déploiement sur un seul serveur (instantané, idéal pour le dev)
      data = await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      console.log(`✅ ${data.length} commande(s) déployée(s) sur le serveur ${config.guildId}.`);
    } else {
      // Déploiement global (peut prendre jusqu'à 1h à se propager)
      data = await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      console.log(`✅ ${data.length} commande(s) déployée(s) globalement.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
