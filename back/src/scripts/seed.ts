import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Departamento } from '../infrastructure/database/entities/departamento.entity';
import config from '../infrastructure/database/database.config';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    const orm = await MikroORM.init<PostgreSqlDriver>(config);
    const em = orm.em;
    console.log('✅ Connected to database successfully!');

    // Verificar si ya existen departamentos
    const existingCount = await em.count(Departamento, {});
    if (existingCount > 0) {
      console.log('ℹ️  Departamentos already exist, skipping seed...');
      await orm.close();
      return;
    }

    // Crear departamentos de ejemplo
    console.log('📝 Creating departments...');
    
    const departamentos = [
      {
        nombre: 'Departamento Atlántico',
        descripcion: 'Hermoso departamento frente al mar con vista panorámica. Ideal para parejas.',
        precio: 15000,
        ubicacion: 'Av. Bunge 123, Pinamar',
        capacidad: 4,
      },
      {
        nombre: 'Departamento Medanos',
        descripcion: 'Acogedor departamento cerca de los médanos, perfecto para familias.',
        precio: 18000,
        ubicacion: 'Calle del Bosque 456, Pinamar',
        capacidad: 6,
      },
      {
        nombre: 'Departamento Centro',
        descripcion: 'Moderno departamento en el centro de Pinamar, cerca de comercios.',
        precio: 12000,
        ubicacion: 'Av. Shaw 789, Pinamar',
        capacidad: 3,
      },
    ];

    for (const deptoData of departamentos) {
      const departamento = em.create(Departamento, deptoData);
      em.persist(departamento);
    }

    await em.flush();
    console.log(`✅ Created ${departamentos.length} departments successfully!`);
    
    await orm.close();
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
}

seedDatabase();