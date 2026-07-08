const fetch = require('node-fetch');

// N'accepte que les liens qui commencent par https://roblox.com/ ou https://www.roblox.com/
const ROBLOX_LINK_REGEX = /^https?:\/\/(www\.)?roblox\.com\//i;

function isValidRobloxLink(link) {
  return typeof link === 'string' && ROBLOX_LINK_REGEX.test(link.trim());
}

function extractPlaceId(link) {
  const match = link.match(/roblox\.com\/games\/(\d+)/i);
  return match ? match[1] : null;
}

// Récupère le nom + la miniature du jeu. Retourne null en cas d'échec (le bot
// doit quand même fonctionner même si l'API Roblox est indisponible).
async function fetchGameInfo(link) {
  try {
    const placeId = extractPlaceId(link);
    if (!placeId) return null;

    const universeRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!universeRes.ok) return null;
    const { universeId } = await universeRes.json();
    if (!universeId) return null;

    const gameRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    const gameJson = await gameRes.json();
    const game = gameJson.data?.[0];
    if (!game) return null;

    let thumbnailUrl = null;
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`
      );
      const thumbJson = await thumbRes.json();
      thumbnailUrl = thumbJson.data?.[0]?.imageUrl || null;
    } catch {
      thumbnailUrl = null;
    }

    return { name: game.name, thumbnailUrl };
  } catch {
    return null;
  }
}

module.exports = { isValidRobloxLink, extractPlaceId, fetchGameInfo };
