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
  // Usar variables individuales para más flexibilidad
  host: process.env.DATABASE_HOST?.replace(/'/g, '') || 'localhost',
  port: parseInt(process.env.DATABASE_PORT?.replace(/'/g, '') || '5432'),
  user: process.env.DATABASE_USER?.replace(/'/g, '') || 'postgres',
  password: process.env.DATABASE_PASSWORD?.replace(/'/g, '') || 'root',
  dbName: process.env.DATABASE_NAME?.replace(/'/g, '') || 'departamentos_pinamar',
  
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE_ENV === 'development',
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    path: join(__dirname, './migrations'),
    pathTs: join(__dirname, './migrations'),
  },
  allowGlobalContext: true, // Solo para desarrollo
  
  // Configuración SSL para producción (Railway)
  driverOptions: {
    connection: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
  },
});