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
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  dbName: process.env.DB_NAME || 'departamentos_pinamar',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    path: join(__dirname, './migrations'),
    pathTs: join(__dirname, './migrations'),
  },
  allowGlobalContext: true, // Solo para desarrollo
});