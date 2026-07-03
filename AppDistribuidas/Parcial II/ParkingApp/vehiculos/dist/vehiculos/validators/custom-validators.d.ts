import { ValidationOptions } from 'class-validator';
export declare const BANNED_SQL_KEYWORDS: Set<string>;
export declare function IsNoSpaces(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsSafeText(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
