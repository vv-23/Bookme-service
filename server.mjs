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

    let results = await connection.query('SELECT * FROM schedule').catch(
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

run();