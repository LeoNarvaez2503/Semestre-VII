CREATE TABLE IF NOT EXISTS autor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS libro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    autor_id INT,
    anio_publicacion INT NOT NULL,
    edicion VARCHAR(255) NOT NULL,
    idioma VARCHAR(255) NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES autor(id) ON DELETE SET NULL
);