const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/db');
const { isValidRobloxLink, fetchGameInfo } = require('../utils/roblox');
const { refreshPanel } = require('../utils/panel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request')
    .setDescription('Soumettre une requête de jeu Roblox à la file d\'attente.')
    .addStringOption((option) =>
      option
        .setName('lien')
        .setDescription('Lien Roblox qui commence par https://roblox.com/')
        .setRequired(true)
    ),

  async execute(interaction) {
    const link = interaction.options.getString('lien').trim();

    if (!isValidRobloxLink(link)) {
      return interaction.reply({
        content: '❌ Le lien doit commencer par `https://roblox.com/` ou `https://www.roblox.com/`.',
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const gameInfo = await fetchGameInfo(link);

    const request = db.create({
      link,
      gameName: gameInfo?.name || null,
      thumbnailUrl: gameInfo?.thumbnailUrl || null,
      requesterId: interaction.user.id,
      requesterTag: interaction.user.tag,
    });

    await refreshPanel(interaction.client);

    await interaction.editReply(
      `✅ Ta requête pour **${request.gameName || 'ce jeu'}** a été ajoutée à la file d'attente !`
    );
  },
};
