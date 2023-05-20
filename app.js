const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

const client = new ModbusRTU();
const HOST = "10.14.139.121";
const PORT = 502;
const ADDRESS_1 = 20128;
const ADDRESS_2 = 20130;
const SLAVE_ID = 1;

// Database configuration
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_DATABASE = "monitoring-gas";
const DB_TABLE = "db_realtime_monitoring_gas";
const DB_TABLE2 = "db_permenit";
const DB_TABLE3 = "db_akhir_hari";
const DB_UPDATE_ID = 1;

async function connectToDatabase() {
  try {
    const pool = await mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("Connected to database");

    return pool;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
}

async function insertValueIntoDatabaseAkhir(
  pool,
  nama_mesin,
  gas_used,
  gas_consumption
) {
  try {
    const rounded_gas_used = parseFloat(gas_used.toFixed(1));
    const [rows, fields] = await pool.execute(
      `INSERT INTO ${DB_TABLE3} (nama_mesin, gas_used, gas_consumption) VALUES (?, ?, ?)`,
      [nama_mesin, rounded_gas_used, gas_consumption]
    );
    console.log(`Inserted values into database akhir hari successfully`);
  } catch (error) {
    console.error(`Error inserting values into database akhir hari: ${error}`);
  }
}

async function insertValueIntoDatabase(
  pool,
  nama_mesin,
  gas_used,
  gas_consumption
) {
  try {
    const rounded_gas_used = parseFloat(gas_used.toFixed(1)); // round value to one decimal place
    // get current timestamp in ISO format
    const [rows, fields] = await pool.execute(
      `INSERT INTO ${DB_TABLE2} (nama_mesin, gas_used, gas_consumption) VALUES (?, ?, ?)`,
      [nama_mesin, rounded_gas_used, gas_consumption]
    );

    // console.log(`Inserted values into database successfully`);
  } catch (error) {
    console.error(`Error inserting values into database: ${error}`);
  }
}

async function updateValueInDatabase(pool, value, column) {
  try {
    const roundedValue = parseFloat(value.toFixed(1)); // round value to one decimal place
    const timestamp = new Date().toISOString(); // get current timestamp in ISO format
    const [rows, fields] = await pool.execute(
      `UPDATE ${DB_TABLE} SET ${column} = ?, timestamp = ? WHERE id = ?`,
      [roundedValue, timestamp, DB_UPDATE_ID]
    );

    // console.log(
    //   `Updated value ${value} in database with timestamp ${timestamp}`
    // );
  } catch (error) {
    console.error(`Error updating value in database: ${error}`);
  }
}

client.connectTCP(HOST, { port: PORT }).then(() => {
  // Set the slave ID to 1
  client.setID(SLAVE_ID);

  // Connect to the database
  connectToDatabase().then((pool) => {
    // Read the Modbus values every second
    setInterval(() => {
      client.readHoldingRegisters(ADDRESS_1, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data gas_used: ${err}`);
          process.exit(1);
        } else {
          // Combine the two registers into a single 32-bit value
          const buffer = Buffer.from(data.buffer);
          const value = buffer.readFloatBE();

          // Update the value in the database
          updateValueInDatabase(pool, value, "gas_used");
        }
      });

      client.readHoldingRegisters(ADDRESS_2, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data gas_consumption: ${err}`);
        } else {
          // Combine the two registers into a single 32-bit value
          const buffer = Buffer.from(data.buffer);
          const value = buffer.readUInt32BE();

          // Update the value in the database
          updateValueInDatabase(pool, value, "gas_consumption");
        }
      });
    }, 500);

    //Insert Data Perlima menit

    setInterval(() => {
      client.readHoldingRegisters(ADDRESS_1, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data both: ${err}`);
        } else {
          // Combine the two registers into a single 32-bit value
          const buffer = Buffer.from(data.buffer);
          const gas_used = buffer.readFloatBE();

          client.readHoldingRegisters(ADDRESS_2, 2, function (err, data) {
            if (err) {
              console.error(`Error reading data both 2: ${err}`);
            } else {
              // Combine the two registers into a single 32-bit value
              const buffer = Buffer.from(data.buffer);
              const gas_consumption = buffer.readUInt32BE();

              // Insert the values into the database if gas_consumption is greater than 0
              if (gas_consumption > 0) {
                insertValueIntoDatabase(
                  pool,
                  "striko1",
                  gas_used,
                  gas_consumption
                );
              }
            }
          });
        }
      });
    }, 60000);
  });
});

client
  .connectTCP(HOST, { port: PORT })
  .then(() => {
    // Set the slave ID to 1
    client.setID(SLAVE_ID);

    // Connect to the database
    connectToDatabase().then((pool) => {
      setInterval(() => {
        client.readHoldingRegisters(ADDRESS_1, 2, function (err, data) {
          if (err) {
            console.error(`Error reading data: ${err}`);
          } else {
            const buffer = Buffer.from(data.buffer);
            const gas_used = buffer.readFloatBE();

            client.readHoldingRegisters(ADDRESS_2, 2, function (err, data) {
              if (err) {
                console.error(`Error reading data: ${err}`);
              } else {
                const buffer = Buffer.from(data.buffer);
                const gas_consumption = buffer.readUInt32BE();

                // Insert the values into the database
                const now = new Date();
                const hour = now.getHours();
                const minute = now.getMinutes();
                const second = now.getSeconds();

                let valueInserted = false;

                if (
                  hour === 08 &&
                  minute === 27 &&
                  second === 0 &&
                  !valueInserted
                ) {
                  insertValueIntoDatabaseAkhir(
                    pool,
                    "Striko 1",
                    gas_used,
                    gas_consumption
                  );
                } else if (hour !== 08 || minute !== 27 || second !== 59) {
                  valueInserted = false;
                }
              }
            });
          }
        });
      }, 1000);
    });
  })

  .catch((error) => {
    console.error(`Error connecting to Modbus TCP server: ${error}`);
    process.exit(1);
  });
