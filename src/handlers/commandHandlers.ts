import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../db/prisma';
import { getElements, getTypeRole, getTypeBaseStats } from '../game/data';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isValidAlias(alias: string): boolean {
  // 2–32 chars, allowed: letters, numbers, spaces, underscore, hyphen
  if (alias.length < 2 || alias.length > 32) return false;
  return /^[a-zA-Z0-9 _-]+$/.test(alias);
}

/**
 * /card create alias:<string> type:<choice>
 */
export async function handleCardCommand(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();

  if (sub !== 'create') {
    await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
    return;
  }

  const userId = interaction.user.id;

  const aliasRaw = interaction.options.getString('alias', true);
  const alias = aliasRaw.trim();

  const typeName = interaction.options.getString('type', true);

  if (!isValidAlias(alias)) {
    await interaction.reply({
      content:
        'Invalid alias. Use 2–32 characters. Allowed: letters, numbers, spaces, underscore, hyphen.',
      ephemeral: true,
    });
    return;
  }

  // One-card-per-user for now (simple and safe)
  const existing = await prisma.card.findFirst({ where: { userId } });
  if (existing) {
    await interaction.reply({
      content: 'You already have a card. (Later: admin-only delete/edit.)',
      ephemeral: true,
    });
    return;
  }

  // Ensure profile exists (creates it if missing)
  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Role comes from types.json; element random on creation
  const role = getTypeRole(typeName);
  const base = getTypeBaseStats(typeName);
  const element = pickRandom(getElements());

  const card = await prisma.card.create({
    data: {
      userId,
      alias,
      type: typeName,
      role,
      element,

      level: 1,
      xp: 0,
      unspentPoints: 0,

      baseHp: base.hp,
      baseDefense: base.defense,
      baseAttack: base.attack,
      baseMind: base.mind,
      baseSpeed: base.speed,
      baseLuck: base.luck,
      baseIntelligence: base.intelligence,
      baseSpellEnergy: base.spellEnergy,

      // alloc* fields default to 0 in Prisma schema
      // Skill system will be added next
      skillIds: [],
      specialSkillId: '',
    },
  });

  // Option A: HP stat -> computed MaxHP
  const finalHpStat = card.baseHp + card.allocHp;
  const maxHp = 50 + finalHpStat * 10 + card.level * 5;

  const embed = new EmbedBuilder()
    .setTitle('Card Created')
    .addFields(
      { name: 'Alias', value: `**${card.alias}**`, inline: true },
      { name: 'Type', value: `${card.type} (${card.role})`, inline: true },
      { name: 'Element', value: card.element, inline: true },
      { name: 'Level', value: String(card.level), inline: true },
      { name: 'Max HP', value: String(maxHp), inline: true },
      { name: 'Unspent Points', value: String(card.unspentPoints), inline: true }
    )
    .setFooter({ text: `Owner: ${interaction.user.username}` });

  await interaction.reply({ embeds: [embed] });
}

/**
 * /profile [user:<@user>]
 */
export async function handleProfileCommand(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('user') ?? interaction.user;
  const userId = targetUser.id;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: { cards: true },
  });

  if (!profile || profile.cards.length === 0) {
    await interaction.reply({
      content: `${targetUser.username} has no card yet. Use \`/card create\`.`,
      ephemeral: true,
    });
    return;
  }

  // One card per user for now
  const card = profile.cards[0];

  const total = card.wins + card.losses;
  const winrate = total === 0 ? '—' : `${Math.round((card.wins / total) * 100)}%`;

  // Final stats = base + alloc (items later)
  const finalHpStat = card.baseHp + card.allocHp;
  const finalDefense = card.baseDefense + card.allocDefense;
  const finalAttack = card.baseAttack + card.allocAttack;
  const finalMind = card.baseMind + card.allocMind;
  const finalSpeed = card.baseSpeed + card.allocSpeed;
  const finalLuck = card.baseLuck + card.allocLuck;
  const finalInt = card.baseIntelligence + card.allocIntelligence;
  const finalSE = card.baseSpellEnergy + card.allocSpellEnergy;

  // Option A formula
  const maxHp = 50 + finalHpStat * 10 + card.level * 5;

  const embed = new EmbedBuilder()
    .setTitle(`${targetUser.username}'s Profile`)
    .addFields(
      { name: 'Alias', value: card.alias, inline: true },
      { name: 'Type', value: `${card.type} (${card.role})`, inline: true },
      { name: 'Element', value: card.element, inline: true },

      { name: 'Level', value: String(card.level), inline: true },
      { name: 'XP', value: String(card.xp), inline: true },
      { name: 'Unspent Points', value: String(card.unspentPoints), inline: true },

      { name: 'Battle-Tokens', value: String(profile.battleTokens), inline: true },
      { name: 'Arena', value: `W:${card.wins} L:${card.losses} (WR: ${winrate})`, inline: true },
      { name: 'Max HP', value: String(maxHp), inline: true },

      {
        name: 'Stats (Final)',
        value:
          `HPstat ${finalHpStat} | DEF ${finalDefense} | ATK ${finalAttack}\n` +
          `MIND ${finalMind} | SPD ${finalSpeed} | LUCK ${finalLuck}\n` +
          `INT ${finalInt} | SE ${finalSE}`,
        inline: false,
      },
      {
        name: 'Stats (Base + Alloc)',
        value:
          `HP ${card.baseHp}+${card.allocHp} | DEF ${card.baseDefense}+${card.allocDefense} | ATK ${card.baseAttack}+${card.allocAttack}\n` +
          `MIND ${card.baseMind}+${card.allocMind} | SPD ${card.baseSpeed}+${card.allocSpeed} | LUCK ${card.baseLuck}+${card.allocLuck}\n` +
          `INT ${card.baseIntelligence}+${card.allocIntelligence} | SE ${card.baseSpellEnergy}+${card.allocSpellEnergy}`,
        inline: false,
      }
    )
    .setFooter({ text: `User ID: ${userId}` });

  await interaction.reply({ embeds: [embed] });
}
