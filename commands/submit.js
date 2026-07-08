const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/db');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Soumettre le travail effectué pour la requête que tu as prise.')
    .addStringOption((option) =>
      option
        .setName('nom_roblox')
        .setDescription('Ton nom d\'utilisateur Roblox')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Capture d\'écran du jeu (ou utilise gofile_link à la place)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('gofile_link')
        .setDescription('Lien GoFile (ou utilise image à la place)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const robloxName = interaction.options.getString('nom_roblox');
    const attachment = interaction.options.getAttachment('image');
    const gofileLink = interaction.options.getString('gofile_link');

    if (!attachment && !gofileLink) {
      return interaction.reply({
        content: '❌ Tu dois fournir soit une **image**, soit un **lien GoFile**.',
        ephemeral: true,
      });
    }

    if (gofileLink && !/^https?:\/\/(www\.)?gofile\.io\//i.test(gofileLink.trim())) {
      return interaction.reply({
        content: '❌ Le lien fourni ne semble pas être un lien GoFile valide (`https://gofile.io/...`).',
        ephemeral: true,
      });
    }

    const request = db.getActiveClaimByUser(interaction.user.id);

    if (!request) {
      return interaction.reply({
        content: "❌ Tu n'as aucune requête en cours. Prends-en une depuis le panel avant d'utiliser `/submit`.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    db.update(request.id, {
      status: 'submitted',
      submission: {
        robloxName,
        imageUrl: attachment?.url || null,
        gofileLink: gofileLink || null,
        submittedAt: Date.now(),
      },
    });

    // Notifie le salon de review
    const reviewChannel = await interaction.client.channels.fetch(config.submitChannelId).catch(() => null);
    if (reviewChannel) {
      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('✅ Nouvelle soumission')
        .addFields(
          { name: '🎮 Jeu', value: `[${request.gameName || 'Jeu Roblox'}](${request.link})` },
          { name: '👤 Complété par', value: `<@${interaction.user.id}>`, inline: true },
          { name: '🧩 Nom Roblox', value: robloxName, inline: true }
        )
        .setTimestamp();

      if (attachment) embed.setImage(attachment.url);
      if (gofileLink) embed.addFields({ name: '📁 Lien GoFile', value: gofileLink });

      await reviewChannel.send({ embeds: [embed] }).catch(() => null);
    }

    await interaction.editReply('✅ Ton travail a été soumis avec succès. Merci !');
  },
};
