import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property()
  nombre!: string;

  @Enum(() => UserRole)
  role!: UserRole;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}