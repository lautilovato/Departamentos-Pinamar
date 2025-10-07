#!/usr/bin/env node
import { execSync } from 'child_process';

const config = './src/infrastructure/database/database.config.ts';
const migrationName = process.argv[2];
let command = `yarn mikro-orm migration:create --config=${config}`;

if (migrationName) {
  command += ` --blank --name=${migrationName}`;
}

console.log(`Ejecutando: ${command}`);
execSync(command, { stdio: 'inherit' });
