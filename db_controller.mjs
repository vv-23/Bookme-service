import mysql from 'mysql2/promise';
import 'dotenv/config'


let config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
}

/**
 * @type {mysql.Pool}
 */
let pool = mysql.createPool(config);
export {pool};

