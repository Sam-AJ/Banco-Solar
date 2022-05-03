const express = require('express');
const app = express();
const { insertarUsuario, consultarUsuarios, actualizarUsuario, eliminarUsuario, insertarTransferencia, consultarTransferencias } = require('./consultas.js');

app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));

app.use(express.json());

// /GET: Devuelve la aplicación cliente.
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

// /usuario POST: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
app.post("/usuario", async (req, res) => {
    try {
        const resp = await insertarUsuario(req.body);
        res.status(201).json(resp.rows ? resp : { code: resp.code})
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido un error en el servidor"});
    }
});

// /usuarios GET: Devuelve todos los usuarios registrados con sus balances.
app.get("/usuarios", async (req, res) => {
    const resp = await consultarUsuarios();
    res.json(resp.rows);
});

// /usuario PUT: Recibe los datos modificados de un usuario registrado y los actualiza.
app.put("/usuario", async (req, res) => {
    let id = req.query.id
    try {
        const resp = await actualizarUsuario(id, req.body);
        res.status(201).json(resp.rows ? resp : { code: resp.code})
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido error en el servidor"});
    }
});

// /usuario DELETE: Recibe el id de un usuario registrado y lo elimina.
app.delete("/usuario", async (req, res) => {
    const id = req.query.id;
    const resp = await eliminarUsuario(id);
    res.json(resp.rows ? resp : { code: resp.code})
});

// /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe ocupar una transacción SQL en la consulta a 
// la base de datos.
app.post("/transferencia", async (req, res) => {
    try {
        const resp = await insertarTransferencia(req.body);
        res.status(201).json(resp.rows ? resp : { code: resp.code})
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido un error en el servidor"});
    }
});

// /transferencias GET: Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo.
app.get("/transferencias", async (req, res) => {
    const resp = await consultarTransferencias();
    res.json(resp.rows);
});