const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  EmbedBuilder,
<<<<<<< HEAD
  PermissionsBitField,
=======
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
} = require('discord.js');

const config = require('./config');
const db = require('./utils/db');
const { refreshPanel } = require('./utils/panel');

<<<<<<< HEAD
const PREFIX = "?";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
=======
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
});

client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Commande chargée : /${command.data.name}`);
  } else {
    console.warn(`⚠️ ${file} ne possède pas "data" et "execute".`);
  }
}

// Bot prêt
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`🤖 Connecté en tant que ${readyClient.user.tag}`);

  try {
    await refreshPanel(readyClient);
  } catch (err) {
    console.error("Erreur lors de l'initialisation du panel :", err);
  }
});

<<<<<<< HEAD
// ===============================
// Commandes avec préfixe
// ===============================
client.on(Events.MessageCreate, async (message) => {

  if (message.author.bot) return;
  if (!message.guild) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "purge") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ Tu n'as pas la permission de supprimer des messages.");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.reply("❌ Utilisation : `?purge <nombre>`");
    }

    if (amount < 1 || amount > 100) {
      return message.reply("❌ Le nombre doit être compris entre 1 et 100.");
    }

    try {

      await message.delete().catch(() => {});

      const deleted = await message.channel.bulkDelete(amount, true);

      const confirm = await message.channel.send(
        `✅ ${deleted.size} message(s) supprimé(s).`
      );

      setTimeout(() => {
        confirm.delete().catch(() => {});
      }, 3000);

    } catch (err) {
      console.error(err);
      message.channel.send("❌ Impossible de supprimer les messages.");
    }
  }
});

=======
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
// Interactions
client.on(Events.InteractionCreate, async (interaction) => {

  // ===============================
  // Commandes Slash
  // ===============================
  if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

      await command.execute(interaction);

    } catch (error) {

      console.error(error);

      const message = {
        content: "❌ Une erreur est survenue en exécutant cette commande.",
        flags: 64,
      };

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp(message);
        } else {
          await interaction.reply(message);
        }
      } catch {}
    }

    return;
  }

  // ===============================
  // Sélection d'une requête
  // ===============================
  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "request_select"
  ) {

    try {

<<<<<<< HEAD
=======
      // Réponse immédiate pour éviter l'expiration
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
      await interaction.deferReply({ flags: 64 });

      const requestId = interaction.values[0];
      const request = db.getById(requestId);

      if (!request || request.status !== "pending") {

        await interaction.editReply({
          content:
            "❌ Cette requête n'est plus disponible (déjà prise ou terminée).",
        });

        await refreshPanel(client);
        return;
      }

<<<<<<< HEAD
=======
      // Mise à jour BDD
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
      db.update(requestId, {
        status: "claimed",
        claimedBy: interaction.user.id,
        claimedAt: Date.now(),
      });

<<<<<<< HEAD
=======
      // Création du MP
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
      const embed = new EmbedBuilder()
        .setColor(0x00b0f4)
        .setTitle("🎮 Requête prise !")
        .setDescription(
          `You claimed a request!\n` +
          `Roblox Game Link: [${request.gameName || "Roblox Game"}](${request.link})\n\n` +
          "Once you're done, submit your work with the /submit command.\n\n" +
          "If you can't finish it, use /cancelrequest."
        );

      if (request.thumbnailUrl) {
        embed.setThumbnail(request.thumbnailUrl);
      }

      let dmSent = true;

      try {
        await interaction.user.send({
          embeds: [embed],
        });
      } catch {
        dmSent = false;
      }

<<<<<<< HEAD
      await refreshPanel(client);

=======
      // Actualisation du panel
      await refreshPanel(client);

      // Réponse
>>>>>>> ce7664c2b4824ff85c8474604d84045e77de3f27
      await interaction.editReply({
        content: dmSent
          ? "✅ Tu as pris cette requête ! Vérifie tes messages privés."
          : "✅ Tu as pris cette requête, mais je n'ai pas pu t'envoyer de message privé.",
      });

    } catch (error) {

      console.error("Erreur lors de la prise de requête :", error);

      try {

        if (interaction.deferred || interaction.replied) {

          await interaction.editReply({
            content: "❌ Une erreur est survenue.",
          });

        } else {

          await interaction.reply({
            content: "❌ Une erreur est survenue.",
            flags: 64,
          });

        }

      } catch {}
    }

    return;
  }

});

client.login(config.token);