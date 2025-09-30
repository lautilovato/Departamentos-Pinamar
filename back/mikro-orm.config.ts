import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

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
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  allowGlobalContext: true, // Solo para desarrollo
});