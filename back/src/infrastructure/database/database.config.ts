import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations'; 
import { join } from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno según el entorno
const isTest = process.env.NODE_ENV === 'test';
const envFile = isTest ? '.env.test' : '.env';
dotenv.config({ path: join(__dirname, '../../../', envFile) });

export default defineConfig({
  // Preferir DATABASE_URL si está presente (Railway / producción)
  clientUrl: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    path: join(__dirname, './migrations'),
    pathTs: join(__dirname, './migrations'),
    snapshot: true,
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshotName: '.snapshot',
  },
  allowGlobalContext: true, // Solo para desarrollo
});