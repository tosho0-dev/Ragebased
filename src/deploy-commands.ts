import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { pingCommand } from './commands/ping';
import { cardCommand } from './commands/card';
import { profileCommand } from './commands/profile';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) throw new Error('Missing DISCORD_TOKEN in .env');
if (!clientId) throw new Error('Missing DISCORD_CLIENT_ID in .env');
if (!guildId) throw new Error('Missing DISCORD_GUILD_ID in .env');

const rest = new REST({ version: '10' }).setToken(token);

async function main() {
  const commands = [
    pingCommand.data.toJSON(),
    cardCommand.data.toJSON(),
    profileCommand.data.toJSON(),
  ];

  console.log('Registering guild slash commands...');
  const result = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  });

  console.log(`Done. Registered ${(result as any[]).length} commands in guild ${guildId}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});