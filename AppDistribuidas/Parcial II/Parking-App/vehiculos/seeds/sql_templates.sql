-- Plantillas SQL para la tabla `vehiculo`
-- Ubicación: seeds/sql_templates.sql
-- Nota: las columnas creadas por TypeORM incluyen algunos nombres con camelCase (por ejemplo "numeroPuertas", "capacidadCarga").

-- =====================
-- INSERT (ejemplo completo)
-- =====================
-- Rellena los valores y ejecuta con psql o desde tu cliente favorito.
INSERT INTO vehiculo (
  placa, marca, modelo, color, anio, clasificacion, tipo,
  "numeroPuertas", "tipo_moto", cilindraje, cabina, "capacidadCarga"
)
VALUES (
  'PLACA001', 'MarcaEj', 'ModeloX', 'Blanco', 2024, 'Gasolina', 'Auto',
  4, NULL, NULL, NULL, NULL
);

-- INSERT con RETURNING (obtener id creado)
INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
VALUES ('PLACA002','Marca2','Modelo2','Negro',2021,'Electrico','Auto')
RETURNING id, placa;

-- =====================
-- UPDATE (ejemplo)
-- =====================
-- Actualiza campos por placa (o por id)
UPDATE vehiculo
SET marca = 'MarcaActualizada', modelo = 'ModeloZ', color = 'Azul', anio = 2022
WHERE placa = 'PLACA001';

-- =====================
-- DELETE (ejemplo)
-- =====================
-- Borrar por placa
DELETE FROM vehiculo WHERE placa = 'PLACA_TEMPORAL';

-- Borrar todos (cuidado)
-- DELETE FROM vehiculo;

-- =====================
-- UPSERT (INSERT...ON CONFLICT)
-- =====================
-- Usa la columna única `placa` para evitar duplicados y actualizar si existe
INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
VALUES ('PLACA001','MarcaUp','ModeloUp','Rojo',2023,'Gasolina','Auto')
ON CONFLICT (placa) DO UPDATE
SET marca = EXCLUDED.marca,
    modelo = EXCLUDED.modelo,
    color = EXCLUDED.color,
    anio = EXCLUDED.anio;

-- =====================
-- TRANSACCIÓN (ejemplo)
-- =====================
BEGIN;
  -- operaciones relacionadas
  INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo)
    VALUES ('TX001','TxMarca','TxModelo','Gris',2020,'Gasolina','Auto');
  UPDATE vehiculo SET color = 'Verde' WHERE placa = 'TX001';
COMMIT;

-- =====================
-- CONSULTAS ÚTILES
-- =====================
-- Ver filas (ordenadas por placa)
SELECT id, placa, marca, modelo, tipo, clasificacion FROM vehiculo ORDER BY placa;

-- Contar por tipo
SELECT tipo, COUNT(*) FROM vehiculo GROUP BY tipo;

-- Buscar por placa
SELECT * FROM vehiculo WHERE placa = 'PLACA001';

-- FIN
