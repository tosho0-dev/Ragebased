import { Interaction } from 'discord.js';
import { handleCardCommand, handleProfileCommand } from './commandHandlers';

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong.');
    return;
  }

  if (interaction.commandName === 'card') {
    await handleCardCommand(interaction);
    return;
  }

  if (interaction.commandName === 'profile') {
    await handleProfileCommand(interaction);
    return;
  }
}