import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../infrastructure/database/entities/user.entity';
import config from '../infrastructure/database/database.config';

async function createAdminUser() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork() as EntityManager;

  try {
    // Verificar si ya existe un admin
    const existingAdmin = await em.findOne(User, { role: UserRole.ADMIN });
    
    if (existingAdmin) {
      console.log('Ya existe un usuario administrador');
      return;
    }

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = em.create(User, {
      email: 'admin@departamentospinamar.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: UserRole.ADMIN,
    });

    await em.persistAndFlush(adminUser);
    
    console.log('Usuario administrador creado exitosamente:');
    console.log('Email: admin@departamentospinamar.com');
    console.log('Password: admin123');
    console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer login');
    
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    await orm.close();
  }
}

createAdminUser();