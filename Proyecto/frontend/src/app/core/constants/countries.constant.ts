export interface Country {
  name: string;
  nationality: string;
  code: string;
}

export const COUNTRIES_LIST: Country[] = [
  { name: 'Ecuador', nationality: 'Ecuatoriana', code: 'EC' },
  { name: 'Colombia', nationality: 'Colombiana', code: 'CO' },
  { name: 'Perú', nationality: 'Peruana', code: 'PE' },
  { name: 'Argentina', nationality: 'Argentina', code: 'AR' },
  { name: 'Bolivia', nationality: 'Boliviana', code: 'BO' },
  { name: 'Brasil', nationality: 'Brasileña', code: 'BR' },
  { name: 'Chile', nationality: 'Chilena', code: 'CL' },
  { name: 'Costa Rica', nationality: 'Costarricense', code: 'CR' },
  { name: 'Cuba', nationality: 'Cubana', code: 'CU' },
  { name: 'España', nationality: 'Española', code: 'ES' },
  { name: 'Estados Unidos', nationality: 'Estadounidense', code: 'US' },
  { name: 'Guatemala', nationality: 'Guatemalteca', code: 'GT' },
  { name: 'Honduras', nationality: 'Hondureña', code: 'HN' },
  { name: 'México', nationality: 'Mexicana', code: 'MX' },
  { name: 'Nicaragua', nationality: 'Nicaragüense', code: 'NI' },
  { name: 'Panamá', nationality: 'Panameña', code: 'PA' },
  { name: 'Paraguay', nationality: 'Paraguaya', code: 'PY' },
  { name: 'República Dominicana', nationality: 'Dominicana', code: 'DO' },
  { name: 'Uruguay', nationality: 'Uruguaya', code: 'UY' },
  { name: 'Venezuela', nationality: 'Venezolana', code: 'VE' },
  { name: 'Canadá', nationality: 'Canadiense', code: 'CA' },
  { name: 'Francia', nationality: 'Francesa', code: 'FR' },
  { name: 'Italia', nationality: 'Italiana', code: 'IT' },
  { name: 'Alemania', nationality: 'Alemana', code: 'DE' }
];

export const VALID_NATIONALITIES: string[] = COUNTRIES_LIST.map(c => c.nationality);
