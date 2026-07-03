"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANNED_SQL_KEYWORDS = void 0;
exports.IsNoSpaces = IsNoSpaces;
exports.IsSafeText = IsSafeText;
const class_validator_1 = require("class-validator");
exports.BANNED_SQL_KEYWORDS = new Set([
    'select', 'insert', 'update', 'delete', 'drop', 'alter', 'create',
    'table', 'database', 'where', 'order', 'by', 'group', 'having',
    'union', 'join', 'exec', 'execute', 'truncate', 'like', 'into'
]);
function IsNoSpaces(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNoSpaces',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    return typeof value === 'string' && !value.includes(' ');
                },
                defaultMessage(args) {
                    return `${args.property} no puede contener espacios.`;
                },
            },
        });
    };
}
function IsSafeText(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSafeText',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    if (/[;]|--|\/\*|\*\//.test(value))
                        return false;
                    const words = value.toLowerCase().match(/\b\w+\b/g);
                    if (words) {
                        for (const word of words) {
                            if (exports.BANNED_SQL_KEYWORDS.has(word)) {
                                return false;
                            }
                        }
                    }
                    return true;
                },
                defaultMessage(args) {
                    return `${args.property} contiene caracteres o términos reservados no permitidos.`;
                },
            },
        });
    };
}
//# sourceMappingURL=custom-validators.js.map