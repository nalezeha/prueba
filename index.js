require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const formatoColombiano = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

async function crear(name, description, image, price) {
    try {
        const resultado = await pool.query(
            'INSERT INTO public."productos" (name, description, image, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, image, price]
        );
        console.log(`Se ha insertado un nuevo producto en la base de datos. Con nombre ${name}, descripción: ${description}, imagen: ${image}, precio: ${formatoColombiano.format(price)}`);
        return resultado.rows[0];
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
        throw error;
    }
}

async function leer() {
    try {
        const resultado = await pool.query('SELECT * FROM public."productos" ORDER BY id ASC');
        return resultado.rows;
    } catch (error) {
        console.error("Error al leer los productos:", error.message);
        throw error;
    }
}

async function actualizar(id, name, description, image, price) {
    try {
        const resultado = await pool.query(
            'UPDATE public."productos" SET name = $2, description = $3, image = $4, price = $5 WHERE id = $1 RETURNING *',
            [id, name, description, image, price]
        );
        console.log(`Se ha actualizado el producto con ID ${id}.`);
        return resultado.rows[0];
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        throw error;
    }
}

async function eliminar(id) {
    try {
        const resultado = await pool.query(
            'DELETE FROM public."productos" WHERE id = $1 RETURNING *',
            [id]
        );
        console.log(`Se ha eliminado el producto con ID ${id}.`);
        return resultado.rows[0];
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        throw error;
    }
}

module.exports = {
    crear,
    leer,
    actualizar,
    eliminar,
};