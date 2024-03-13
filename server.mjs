// Get the client
import mysql from 'mysql2/promise';
import express from 'express'
//const asyncHandler = require('express-async-handler');


import { pool } from './db_controller.mjs';

const app = express();
app.use(express.json())

/**
 * @type {mysql.Connection}
 */
let connection = undefined;
/**
 * @type {mysql.Pool}
 */
let _pool = undefined;
let config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
}

async function run() {
    // Create the connection to database
    /*console.log(process.env.SQL_HOST)
    console.log(process.env.SQL_USER)
    console.log(process.env.SQL_PASSWORD)
    console.log(process.env.SQL_DB)*/
    /*connection = await mysql.createConnection(config).catch((error) => {
        console.log("Error connecting. Aborting")
        console.log(error);
        process.exit(1);
    });*/
    /*pool = await mysql.createPool(config).catch((error) => {
        console.log("Error connecting. Aborting");
        console.log(error);
        process.exit(1);
    });*/

    app.listen(process.env.SERVER_PORT, () => {
        console.log(`App listening on port ${process.env.SERVER_PORT}`);
    });
}

app.get('/schedule', async (req, res) => {
    console.log("/schedule GET");
    const schedule_data = req.body;
    console.log(schedule_data);
    let results = undefined;

    if ((schedule_data.availability === true) && ("slot" in schedule_data)) {
        let sql = "SELECT * FROM schedule WHERE startDate < ? AND ? < endDate AND startTime < ? AND ? < endTime";
        results = await pool.query(sql, [schedule_data.slot.date, schedule_data.slot.date, schedule_data.slot.startTime, schedule_data.slot.endTime]).catch(
            (error) => {
                console.log(error);
                res.status(500).json(
                    {
                        message: error.sqlMessage
                    }
                )
            }
        );
    }
    else if ("servicId" in schedule_data) {
        results = await pool.query("SELECT * FROM schedule WHERE servicId = ?", [schedule_data.servicId]).catch(
            (error) => {
                console.log(error);
                res.status(500).json(
                    {
                        message: error.sqlMessage
                    }
                )
            }
        );
    }
    else
    {
        results = await pool.query('SELECT * FROM schedule').catch(
            (error) => {
                console.log(error);
                res.status(500).json(
                    {
                        message: error.sqlMessage
                    }
                )
            }
        );
    }
    if (results) {
        console.log(results[0])
        res.status(200).json(results[0])
    }
});

app.post('/schedule', async (req, res) => {
    console.log("/schedule POST");
    const schedule_data = req.body;
    console.log(schedule_data)

    let results = await pool.query('INSERT INTO schedule SET ?', schedule_data).catch(
        (error) => {
            console.log(error);
            res.status(500).json(
                {
                    message: error.sqlMessage
                }
            )
        }
    );
    if (results) {
        console.log(results);
        res.status(200).json({"scheduleID": results[0].insertId});
    }
});

app.delete("/schedule", async(req, res) => {
    console.log("/schedule DELETE")
    const schedule_data = req.body;
    console.log(schedule_data);
    let results = undefined;

    if (("scheduleID" in schedule_data) && Array.isArray(schedule_data.scheduleID)) {
        results = await pool.query("DELETE FROM schedule WHERE scheduleID = ?", schedule_data.scheduleID).catch(
            (error) => {
                console.log(error);
                res.status(500).json(
                    {
                        message: error.sqlMessage
                    }
                )
            }
        );
    }
    else {
        res.sendStatus(400);
        return;
    }
    if (results) {
        console.log(results);
        res.sendStatus(200);
    }
})

run();