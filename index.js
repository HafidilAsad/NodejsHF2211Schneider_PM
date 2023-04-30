const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

const client = new ModbusRTU();
const HOST = "10.14.139.121";
const PORT = 502;
const ADDRESS = 20128;
const SLAVE_ID = 1;

const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_DATABASE = "monitoring-gas";
const DB_TABLE = "monitoring_gas30";
const DB_UPDATE_ID = 1;

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    });

    console.log("Connected to database");

    return connection;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}

async function updateValueInDatabase(connection, value) {
  try {
    const roundedValue = parseFloat(value.toFixed(1));
    const [rows, fields] = await connection.execute(
      `UPDATE ${DB_TABLE} SET gas_used = ? WHERE id = ?`,
      [roundedValue, DB_UPDATE_ID]
    );
  } catch (error) {
    console.error(`Error updating value in database: ${error}`);
  }
}

client
  .connectTCP(HOST, { port: PORT })
  .then(() => {
    // Set the slave ID to 1
    client.setID(SLAVE_ID);

    // Connect to the database
    connectToDatabase().then((connection) => {
      // Read the Modbus value every second
      setInterval(() => {
        client.readHoldingRegisters(ADDRESS, 2, function (err, data) {
          if (err) {
            console.error(`Error reading data: ${err}`);
          } else {
            // Combine the two registers into a single 32-bit value
            const buffer = Buffer.from(data.buffer);
            const value = buffer.readFloatBE();

            // jika mau make int
            //const intValue = Math.round(value);

            // Update the value in the database
            updateValueInDatabase(connection, value);
          }
        });
      }, 500);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to Modbus TCP server: ${error}`);
  });
