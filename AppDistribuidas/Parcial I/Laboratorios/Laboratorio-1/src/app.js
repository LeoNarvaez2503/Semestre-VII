const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();


const autorRoutes = require('./routes/autorRoutes');
const libroRoutes = require('./routes/libroRoutes');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.use('/api/autores',autorRoutes);
app.use('/api/libros',libroRoutes);


const initDb = async () => {
  try{
    const sqlPath = path.join(__dirname, '../scripts/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await db.query(sql);
    console.log("Base de datos inicializada correctamente.");
  }catch(err){
    console.error("Error al inicializar la base de datos:", err.message);
  }
};

initDb();
app.get('/',(req,res) => {
    res.send("Bienvenido");
    console.log("Bienvenido");
});

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})