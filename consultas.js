const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgresql',
    host: 'localhost',
    database: 'bancosolar',
    port: 5432
});

const insertarUsuario = async (usuario) => {
    const { nombre, balance } = usuario;

    try {
        const config = {
            text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
            values: [nombre, balance]
        };
        const resp = await pool.query(config);
        return resp;    
    } catch (error) {
        return error;
    }
}

const consultarUsuarios = async () => {
    try {
        const query = "SELECT * FROM usuarios";
        const resp = await pool.query(query);
        return resp;
    } catch (error) {
        return error;
    }
}

const actualizarUsuario = async (id, usuario) => {
    const { nombre, balance } = usuario;

    const config = {
        text:"UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
        values:[nombre, balance, id]
    }

    try {
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
}

const eliminarUsuario = async (id) => {
    const config = {
        text:"DELETE FROM usuarios WHERE id = $1 RETURNING *",
        values: [id]
    }

    try {
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
}

const insertarTransferencia = async (datos) => {
    let { emisor, receptor, monto } = datos;

    try {
        await pool.query("BEGIN");

        const descontar = {
            text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
            values: [monto, emisor]
        }
        const resDescontar = await pool.query(descontar);
        console.table(resDescontar.rows)

        const acreditar = {
            text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
            values: [monto, receptor]
        }
        const resAcreditar = await pool.query(acreditar);
        console.table(resAcreditar.rows)

        const nuevaTransferencia = {
            text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
            values: [emisor, receptor, monto]
        }
        const resNuevaTransferencia = await pool.query(nuevaTransferencia);
        console.table(resNuevaTransferencia.rows)

        await pool.query("COMMIT");

        return resNuevaTransferencia;
    } catch (error) {
        await pool.query("ROLLBACK");
        console.log(`Código de error: ${error.code}`);
        console.log(`Detalle del error: ${error.detail}`);
        console.log(`Tabla originaria del error: ${error.table}`);
        console.log(`Restricción violada en el campo: ${error.constraint}`);
    }
}

const consultarTransferencias = async () => {
    try {
        const config = {
            text: "SELECT * FROM transferencias",
            rowMode: "array"
        }
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
}

module.exports = { insertarUsuario, consultarUsuarios, actualizarUsuario, eliminarUsuario, insertarTransferencia, consultarTransferencias }