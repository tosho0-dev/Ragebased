import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.trim().length === 0) {
  throw new Error('DATABASE_URL is missing (or empty) in your .env file.');
}

// Create a pg Pool and wrap it with Prisma’s PostgreSQL adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });