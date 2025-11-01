import {
    BaseEntity,
    Entity,
    Enum,
    OneToOne,
    type Opt,
    PrimaryKey,
    Property,
  } from '@mikro-orm/core';

import * as bcrypt from 'bcrypt-ts';
import { CustomBaseEntity } from './BaseEntity.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export enum UserRole {
    ADMIN = 'ADMIN',
}

@Entity()
export class User extends CustomBaseEntity {
    @PrimaryKey({ type: 'integer', autoincrement: true })
    id!: number & Opt;

    @Property({ fieldName: 'email', nullable: false, unique: true })
    email: string;

    @Property({ fieldName: 'password', nullable: false })
    password: string;

    @Enum({ items: () => UserRole, nativeEnumName: 'user_role' })
    role!: UserRole;
    constructor(data: { email: string; password: string; role: UserRole }) {
        super();
        this.password = data.password;
        this.email = data.email;
        this.role = data.role;
        this.getType(data.role);
    }

    getType(role: UserRole) {
        const types = {
        [UserRole.ADMIN]: () => {},
        };

        types[role]?.();
    }

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    validateCorrectRole(role: UserRole) {
        const isCorrect = this.role === role;

        if (!isCorrect) {
        throw new ForbiddenException('El rol no es correcto');
        }
    }

    async validatePassword(password: string) {
        const isValid = await bcrypt.compare(password, this.password);

        if (!isValid) {
        throw new BadRequestException('Email o contraseña incorrectos');
        }
    }
}