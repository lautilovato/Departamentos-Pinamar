import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class CustomBaseEntity {
  @Property({
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `now()`,
    fieldName: 'created_at',
  })
  createdAt!: Date & Opt;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
  })
  updatedAt!: Date & Opt;
}