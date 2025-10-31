import * as dotenv from 'dotenv';
dotenv.config();

import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../infrastructure/database/entities/user.entity';
import { Departamento } from '../infrastructure/database/entities/departamento.entity';
import { Reserva } from '../infrastructure/database/entities/reserva.entity';
import { ReservaRequest } from '../infrastructure/database/entities/reservaRequest.entity';

async function createAdminUser() {
  // Verificar que DATABASE_URL esté definido
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definido en las variables de entorno');
    process.exit(1);
  }

  console.log('🔌 Conectando a la base de datos de producción...');
  console.log('URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Ocultar password

  const orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL, // Usar SOLO la URL de producción
    entities: [Departamento, Reserva, ReservaRequest, User],
    debug: true,
    allowGlobalContext: true,
  });
  
  const em = orm.em.fork() as EntityManager;

  try {
    console.log('🔍 Verificando usuarios admin existentes...');
    
    // Verificar si ya existe un admin
    const existingAdmin = await em.findOne(User, { role: UserRole.ADMIN });
    
    if (existingAdmin) {
      console.log('✅ Ya existe un usuario administrador en PRODUCCIÓN:');
      console.log('Email:', existingAdmin.email);
      console.log('Nombre:', existingAdmin.nombre);
      return;
    }

    console.log('👤 Creando usuario administrador...');

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = em.create(User, {
      email: 'admin@departamentospinamar.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: UserRole.ADMIN,
    });

    await em.persistAndFlush(adminUser);
    
    console.log('✅ Usuario administrador creado exitosamente en PRODUCCIÓN:');
    console.log('📧 Email: admin@departamentospinamar.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
  } finally {
    await orm.close();
    console.log('🔌 Conexión cerrada');
  }
}

createAdminUser();