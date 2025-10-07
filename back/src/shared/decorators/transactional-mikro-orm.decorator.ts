import { Transactional } from '@mikro-orm/core';

/**
 * Aplica @Transactional() a todos los métodos públicos de una clase.
 */
export function TransactionalMikroOrmClass(): ClassDecorator {
  return function (target: any) {
    const prototype = target.prototype;

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === 'constructor') continue;

      const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      const isMethod = descriptor?.value instanceof Function;

      if (!isMethod) continue;

      const isAsync = descriptor.value.constructor.name === 'AsyncFunction';
      if (!isAsync) continue;
      // Aplicar el decorador @Transactional correctamente
      const transactionalDecorator = Transactional();
      transactionalDecorator(prototype, key, descriptor);

      // Redefinir el método decorado
      Object.defineProperty(prototype, key, descriptor);
    }
  };
}
