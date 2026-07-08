require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  // Salon où le panel des requêtes est affiché.
  // Valeur par défaut = le salon demandé, mais reste modifiable via .env
  panelChannelId: process.env.PANEL_CHANNEL_ID || '1524417681665818775',
  // Salon où les /submit sont postés pour review (par défaut = même salon que le panel)
  submitChannelId: process.env.SUBMIT_CHANNEL_ID || process.env.PANEL_CHANNEL_ID || '1524417681665818775',
};
