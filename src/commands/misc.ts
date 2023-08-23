import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { CommandHandler } from "../interfaces/CommandHandler";
import { handleSay } from "../modules/subcommands/handleSay";
import { errorHandler } from "../utils/errorHandler";

const handlers: { [key: string]: CommandHandler } = {
  say: handleSay,
};

export const misc: Command = {
  data: new SlashCommandBuilder()
    .setName("misc")
    .setDescription("Commands that don't fit elsewhere.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("say")
        .setDescription("Want Naomi to say something?")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("What you want Naomi to say.")
            .setRequired(true)
            .setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("colour")
            .setDescription("The hex string to use for the text.")
            .setMinLength(6)
            .setMaxLength(7)
        )
        .addStringOption((option) =>
          option
            .setName("background")
            .setDescription("The hex string to use for the background.")
            .setMinLength(6)
            .setMaxLength(7)
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      handlers[subcommand]
        ? await handlers[subcommand](bot, interaction)
        : await interaction.editReply({
            content:
              "I have failed you once again. The command you used does not have an instruction manual for me.",
          });
    } catch (err) {
      await errorHandler(bot, "misc command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  },
};