import { EmbedBuilder } from "discord.js";

import { AssetHandler, Outfit } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random outfit.
 */
export const handleOutfitAsset: AssetHandler = async (
  bot
): Promise<EmbedBuilder> => {
  try {
    let outfit = {
      fileName: "test",
      name: "Test Asset",
      alt: "Test Alt",
      description: "Test Description",
    };
    let index = 1;
    let total = 1;
    if (!process.env.MOCHA) {
      const fileList = await getAssetList<Outfit[]>("naomi", "outfits");
      outfit = getRandomValue(fileList);
      index = fileList.findIndex((f) => f.fileName === outfit.fileName) + 1;
      total = fileList.length;
    }

    const embed = new EmbedBuilder();
    embed.setTitle(outfit.name);
    embed.setDescription(outfit.description);
    embed.setImage(`https://cdn.naomi.lgbt/naomi/outfits/${outfit.fileName}`);
    embed.setFooter({
      text: `Outfit ${index} of ${total}`,
      iconURL: `https://cdn.nhcarrigan.com/avatars/naomi.png`,
    });

    return embed;
  } catch (err) {
    await errorHandler(bot, "handle outfit asset", err);
    return defaultAssetEmbed;
  }
};
