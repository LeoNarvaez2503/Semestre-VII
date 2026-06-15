-- Seeds para la tabla `vehiculo`
-- Ejecutar con: sudo -u postgres psql -d gestion_vehiculos -f seeds/insert_vehiculos.sql

INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo, "numeroPuertas")
VALUES
('ABC123', 'Toyota', 'Corolla', 'Blanco', 2018, 'Gasolina', 'Auto', 4),
('TESTAUTO1', 'Tesla', 'Model 3', 'Rojo', 2022, 'Electrico', 'Auto', 4);

INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo, tipo_moto, cilindraje)
VALUES
('MOTO001', 'Yamaha', 'YZF-R3', 'Azul', 2020, 'Gasolina', 'Motocicleta', 'Deportiva', 321),
('MOTO002', 'Honda', 'PCX', 'Negro', 2019, 'Gasolina', 'Motocicleta', 'Scooter', 150);

INSERT INTO vehiculo (placa, marca, modelo, color, anio, clasificacion, tipo, cabina, "capacidadCarga")
VALUES
('CAM123', 'Ford', 'Ranger', 'Gris', 2017, 'Diesel', 'Camioneta', 'Doble', 1000);

-- Consulta de verificación rápida:
-- SELECT id, placa, marca, tipo, clasificacion FROM vehiculo ORDER BY placa;
