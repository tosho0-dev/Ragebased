import { SlashCommandBuilder } from 'discord.js';
import { getTypes } from '../game/data';

export const cardCommand = {
  data: new SlashCommandBuilder()
    .setName('card')
    .setDescription('Manage your card')
    .addSubcommand((sub) =>
      sub
        .setName('create')
        .setDescription('Create your card (one-time).')
        .addStringOption((opt) =>
          opt
            .setName('alias')
            .setDescription('Card display name / alias')
            .setRequired(true)
            .setMaxLength(32)
        )
        .addStringOption((opt) => {
          opt.setName('type').setDescription('Choose your type').setRequired(true);
          for (const t of getTypes()) {
            opt.addChoices({ name: `${t.name} (${t.role})`, value: t.name });
          }
          return opt;
        })
    ),
};