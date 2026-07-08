const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/db');
const { refreshPanel } = require('../utils/panel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancelrequest')
    .setDescription('Remet la requête que tu as prise dans la file d\'attente.'),

  async execute(interaction) {
    const request = db.getActiveClaimByUser(interaction.user.id);

    if (!request) {
      return interaction.reply({
        content: "❌ Tu n'as aucune requête en cours à annuler.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    db.update(request.id, {
      status: 'pending',
      claimedBy: null,
      claimedAt: null,
    });

    await refreshPanel(interaction.client);

    await interaction.editReply(
      `↩️ La requête pour **${request.gameName || 'ce jeu'}** a été remise dans la file d'attente.`
    );
  },
};
