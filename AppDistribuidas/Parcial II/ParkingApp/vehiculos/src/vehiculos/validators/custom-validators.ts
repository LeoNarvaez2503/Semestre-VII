import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export const BANNED_SQL_KEYWORDS = new Set([
  'select', 'insert', 'update', 'delete', 'drop', 'alter', 'create',
  'table', 'database', 'where', 'order', 'by', 'group', 'having',
  'union', 'join', 'exec', 'execute', 'truncate', 'like', 'into'
]);

export function IsNoSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNoSpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && !value.includes(' ');
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no puede contener espacios.`;
        },
      },
    });
  };
}

export function IsSafeText(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSafeText',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Verificar caracteres de comentarios y terminadores SQL peligrosos
          if (/[;]|--|\/\*|\*\//.test(value)) return false;

          // Verificar si hay palabras clave SQL aisladas
          const words = value.toLowerCase().match(/\b\w+\b/g);
          if (words) {
            for (const word of words) {
              if (BANNED_SQL_KEYWORDS.has(word)) {
                return false;
              }
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contiene caracteres o términos reservados no permitidos.`;
        },
      },
    });
  };
}
