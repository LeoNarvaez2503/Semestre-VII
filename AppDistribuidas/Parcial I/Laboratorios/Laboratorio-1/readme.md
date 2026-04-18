npm init -y
npm install express mysql12 dotenv cors
npm install -D nodemon
libro - autor
    libro
        - id
        - titulo
        - isbn
        - autor_id (fk)
        - anio_publicacion
        - edicion
        - idioma
    autor:
        - id
        - nombres
        - apellidos
        - fecha_nacimiento
        - nacionalidad
        - correo_electronico
#TAREA
COMPLETAR:
/models/Libro.js

SELECT * FROM sp_buscar_por_id(?)

## **Crear el metodo - funcion- etc que permita buscar un autor dado el nombre o apellido o un fragmento de la palabra, validar mayusuculas, minusculas**