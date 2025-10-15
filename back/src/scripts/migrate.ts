import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../infrastructure/database/database.config';

async function runMigrations() {
  console.log('🚀 Starting database migration...');
  console.log('📡 Connecting to:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
  
  try {
    const orm = await MikroORM.init<PostgreSqlDriver>(config);
    console.log('✅ Connected to database successfully!');
    
    // Crear schema completo
    console.log('📋 Creating database schema...');
    await orm.getSchemaGenerator().createSchema();
    console.log('✅ Schema created successfully!');
    
    await orm.close();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();