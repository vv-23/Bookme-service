// Get the client
import mysql from 'mysql2/promise';
import express from 'express'

const app = express();
app.use(express.json())

/**
 * @type {mysql.Connection}
 */
let connection = undefined;

async function run() {
    // Create the connection to database
    /*console.log(process.env.SQL_HOST)
    console.log(process.env.SQL_USER)
    console.log(process.env.SQL_PASSWORD)
    console.log(process.env.SQL_DB)*/
    connection = await mysql.createConnection({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB,
    }).catch((error) => {
        console.log("Error connecting. Aborting")
        console.log(error);
        process.exit(1);
    });
    app.listen(3000, () => {
        console.log("App listening on port 3000");
    });
}

app.get('/schedule', async (req, res) => {
    console.log("/schedule GET")
    const schedule_data = req.body;
    console.log(schedule_data)
    let results = undefined;

    if ((schedule_data.availability === true) && ("slot" in schedule_data)) {
        let sql = "SELECT * FROM schedule WHERE startDate < ? AND ? < endDate AND startTime < ? AND ? < endTime"
        results = await connection.query(sql, [schedule_data.slot.date, schedule_data.slot.date, schedule_data.slot.startTime, schedule_data.slot.endTime]).catch(
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
        results = await connection.query("SELECT * FROM schedule WHERE servicId = ?", [schedule_data.servicId]).catch(
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
        results = await connection.query('SELECT * FROM schedule').catch(
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
    console.log("/schedule POST")
    const schedule_data = req.body;
    console.log(schedule_data)

    let results = await connection.query('INSERT INTO schedule SET ?', schedule_data).catch(
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
        console.log(results)
        res.sendStatus(200)
    }
});

app.delete("/schedule", async(req, res) => {
    console.log("/schedule DELETE")
    const schedule_data = req.body;
    console.log(schedule_data);
    let results = undefined;

    if (("scheduleID" in schedule_data) && Array.isArray(schedule_data.scheduleID)) {
        results = await connection.query("DELETE FROM schedule WHERE scheduleID = ?", schedule_data.scheduleID).catch(
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
        res.sendStatus(400)
        return
    }
    if (results) {
        console.log(results)
        res.sendStatus(200)
    }
})

run();