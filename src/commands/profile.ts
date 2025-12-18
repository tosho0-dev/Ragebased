import { SlashCommandBuilder } from 'discord.js';

export const profileCommand = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Show your profile (or someone else’s).')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User to view (optional)').setRequired(false)
    ),
};