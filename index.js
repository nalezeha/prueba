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

async function conexion() {
    try {
        const resultado = await pool.query('SELECT * FROM public."productos"');
        console.log("Conexión exitosa a la base de datos:", resultado.rows);
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    } finally {
        await pool.end();
    }
}

async function crear(name, description, image, price) {
    try {
        await pool.query(
            'INSERT INTO public."productos" (name, description, image, price) VALUES ($1, $2, $3, $4)',
            [name, description, image, price]
        );
        console.log(`Se ha insertado un nuevo producto en la base de datos. Con nombre ${name}, descripción: ${description}, imagen: ${image}, precio: ${formatoColombiano.format(price)}`);
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
    } finally {
        await pool.end();
    }
}

async function leer() {
    try {
        const resultado = await pool.query('SELECT * FROM public."productos" ORDER BY id ASC');
        console.log("Productos en la base de datos:", resultado.rows);
    } catch (error) {
        console.error("Error al leer los productos:", error.message);
    } finally {
        await pool.end();
    }
}

async function actualizar(id, name, description, image, price) {
    try {
        await pool.query(
            'UPDATE public."productos" SET name = $2, description = $3, image = $4, price = $5 WHERE id = $1',
            [id, name, description, image, price]
        );
        console.log(`Se ha actualizado el producto con ID ${id}.`);
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
    } finally {
        await pool.end();
    }
}

async function eliminar(id) {
    try {
        await pool.query(
            'DELETE FROM public."productos" WHERE id = $1',
            [id]
        );
        console.log(`Se ha eliminado el producto con ID ${id}.`);
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
    } finally {
        await pool.end();
    }
}
