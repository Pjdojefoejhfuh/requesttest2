const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const db = require('./db');
const config = require('../config');

const MAX_OPTIONS = 25; // limite Discord pour un select menu

function buildPanelPayload() {
  const pending = db.getPending().sort((a, b) => a.createdAt - b.createdAt);

  const embed = new EmbedBuilder()
    .setColor(0x00b0f4)
    .setTitle('📋 File d\'attente des requêtes Roblox')
    .setFooter({ text: 'Utilise le menu ci-dessous pour prendre une requête' })
    .setTimestamp();

  if (pending.length === 0) {
    embed.setDescription('Aucune requête en attente pour le moment.\nUtilise `/request` pour en soumettre une !');
  } else {
    const lines = pending
      .slice(0, MAX_OPTIONS)
      .map((r, i) => `**${i + 1}.** [${r.gameName || 'Jeu Roblox'}](${r.link}) — demandé par <@${r.requesterId}>`);

    if (pending.length > MAX_OPTIONS) {
      lines.push(`\n*+ ${pending.length - MAX_OPTIONS} autre(s) requête(s) en attente...*`);
    }

    embed.setDescription(lines.join('\n'));
  }

  const components = [];

  if (pending.length > 0) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('request_select')
      .setPlaceholder('Choisis une requête à prendre...')
      .addOptions(
        pending.slice(0, MAX_OPTIONS).map((r) => ({
          label: (r.gameName || 'Jeu Roblox').slice(0, 100),
          description: `Demandé par ${r.requesterTag || 'inconnu'}`.slice(0, 100),
          value: r.id,
        }))
      );

    components.push(new ActionRowBuilder().addComponents(menu));
  }

  return { embeds: [embed], components };
}

async function refreshPanel(client) {
  const channel = await client.channels.fetch(config.panelChannelId).catch(() => null);
  if (!channel) {
    console.warn(`⚠️  Impossible de trouver le salon panel (${config.panelChannelId}).`);
    return null;
  }

  const payload = buildPanelPayload();
  const panelData = db.getPanel();

  if (panelData.messageId) {
    const existing = await channel.messages.fetch(panelData.messageId).catch(() => null);
    if (existing) {
      return existing.edit(payload);
    }
  }

  const sent = await channel.send(payload);
  db.setPanel({ channelId: channel.id, messageId: sent.id });
  return sent;
}

module.exports = { refreshPanel, buildPanelPayload };
