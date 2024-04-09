const express = require('express');
const { dbConection } = require('./database/config');
const cors = require('cors')
require('dotenv').config();

console.log(process.env)

//crear el servidor de express
const app = express();

//Base de Datos
dbConection();

// cors
app.use(cors())

//Directorio publico
app.use( express.static('public') );

//lectura y parseo del body
app.use( express.json() )

//rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

//escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
})