const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");
const Long = require("long");

const client = new ModbusRTU();
const HOST = "10.14.139.119";
const PORT = 502;
const ADDRESS_1 = 3059; //PTOT
const ADDRESS_2 = 3009; //IAVG
const ADDRESS_3 = 3203;
const ADDRESS_4 = 3025;
//arussssssssss==================================
const ADDRESS_5 = 2999;
const ADDRESS_6 = 3001;
const ADDRESS_7 = 3003;
//Tegangannn ====================================
const ADDRESS_8 = 3019;
const ADDRESS_9 = 3021;
const ADDRESS_10 = 3023;
//Tegangannn =================
const SLAVE_ID = 1;

// Database configuration
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_DATABASE = "monitoring-gas";
const DB_TABLE = "db_realtime_monitoring_gas";
const DB_TABLE2 = "permenit_mc57";
const DB_TABLE3 = "perjam_mc57";
const DB_TABLE4 = "punya_aji";
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
async function insertValueIntoDatabasePerjam(pool, e_del) {
  try {
    const [rows, fields] = await pool.execute(
      `INSERT INTO ${DB_TABLE3} ( e_del) VALUES ( ? )`,
      [e_del]
    );

    // console.log(`Inserted values into database successfully`);
  } catch (error) {
    console.error(`Error inserting values into database: ${error}`);
  }
}

async function insertValueIntoDatabase(
  pool,
  p_tot,
  i_avg,
  i_1,
  i_2,
  i_3,
  v_1,
  v_2,
  v_3,
  v_avg
) {
  try {
    const [rows, fields] = await pool.execute(
      `INSERT INTO ${DB_TABLE2} ( ptot, i_avg, i_1, i_2, i_3, v_1, v_2, v_3, v_avg) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p_tot, i_avg, i_1, i_2, i_3, v_1, v_2, v_3, v_avg]
    );

    // console.log(`Inserted values into database successfully`);
  } catch (error) {
    console.error(`Error inserting values into database: ${error}`);
  }
}

async function updateValueInDatabase(pool, value, column) {
  try {
    const roundedValue = parseFloat(value); // round value to one decimal place
    const timestamp = new Date().toISOString(); // get current timestamp in ISO format
    const [rows, fields] = await pool.execute(
      `UPDATE ${DB_TABLE4} SET ${column} = ? WHERE id = ?`,
      [roundedValue, DB_UPDATE_ID]
    );

    // console.log(`Updated value ${value} in database with `);
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
          const buffer = Buffer.from(data.buffer);
          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "ptot");
        }
      });

      //Aruss==========================================================
      client.readHoldingRegisters(ADDRESS_5, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data i_1: ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "i_1");
        }
      });

      client.readHoldingRegisters(ADDRESS_6, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data i_2: ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "i_2");
        }
      });

      client.readHoldingRegisters(ADDRESS_7, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data i_3: ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "i_3");
        }
      });

      client.readHoldingRegisters(ADDRESS_2, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data gas_consumption: ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "i_avg");
        }
      });

      //Tegangannn======================================================

      client.readHoldingRegisters(ADDRESS_8, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data v1 ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "v_1");
        }
      });

      client.readHoldingRegisters(ADDRESS_9, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data v2 ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "v_2");
        }
      });

      client.readHoldingRegisters(ADDRESS_10, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data v3 ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "v_3");
        }
      });

      client.readHoldingRegisters(ADDRESS_4, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data vavg ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);

          const value = buffer.readFloatBE().toFixed(1);

          updateValueInDatabase(pool, value, "v_avg");
        }
      });

      client.readHoldingRegisters(ADDRESS_3, 8, function (err, data) {
        if (err) {
          console.error(`Error reading data e_del: ${err}`);
        } else {
          const buffer = Buffer.from(data.buffer);
          const highBits = buffer.readUInt32BE(0);
          const lowBits = buffer.readUInt32BE(4);
          const value = (BigInt(highBits) << BigInt(32)) + BigInt(lowBits); // Read UInt64 value

          updateValueInDatabase(pool, value, "e_del");
        }
      });
    }, 5000);

    //Insert Data Permenit
    setInterval(() => {
      client.readHoldingRegisters(ADDRESS_1, 2, function (err, data) {
        if (err) {
          console.error(`Error reading data ptot: ${err}`);
        } else {
          // Combine the two registers into a single 32-bit value
          const buffer = Buffer.from(data.buffer);
          const p_tot = buffer.readFloatBE().toFixed(1);

          client.readHoldingRegisters(ADDRESS_2, 2, function (err, data) {
            if (err) {
              console.error(`Error reading data i_avg: ${err}`);
            } else {
              // Combine the two registers into a single 32-bit value
              const buffer = Buffer.from(data.buffer);
              const i_avg = buffer.readFloatBE().toFixed(1);

              client.readHoldingRegisters(ADDRESS_5, 2, function (err, data) {
                if (err) {
                  console.error(`Error reading data i_1: ${err}`);
                } else {
                  // Combine the two registers into a single 32-bit value
                  const buffer = Buffer.from(data.buffer);
                  const i_1 = buffer.readFloatBE().toFixed(1);

                  client.readHoldingRegisters(
                    ADDRESS_6,
                    2,
                    function (err, data) {
                      if (err) {
                        console.error(`Error reading data i_2: ${err}`);
                      } else {
                        // Combine the two registers into a single 32-bit value
                        const buffer = Buffer.from(data.buffer);
                        const i_2 = buffer.readFloatBE().toFixed(1);

                        client.readHoldingRegisters(
                          ADDRESS_7,
                          2,
                          function (err, data) {
                            if (err) {
                              console.error(`Error reading data i_3: ${err}`);
                            } else {
                              // Combine the two registers into a single 32-bit value
                              const buffer = Buffer.from(data.buffer);
                              const i_3 = buffer.readFloatBE().toFixed(1);

                              client.readHoldingRegisters(
                                ADDRESS_8,
                                2,
                                function (err, data) {
                                  if (err) {
                                    console.error(
                                      `Error reading data v_1: ${err}`
                                    );
                                  } else {
                                    // Combine the two registers into a single 32-bit value
                                    const buffer = Buffer.from(data.buffer);
                                    const v_1 = buffer.readFloatBE().toFixed(1);

                                    client.readHoldingRegisters(
                                      ADDRESS_9,
                                      2,
                                      function (err, data) {
                                        if (err) {
                                          console.error(
                                            `Error reading data v_1: ${err}`
                                          );
                                        } else {
                                          // Combine the two registers into a single 32-bit value
                                          const buffer = Buffer.from(
                                            data.buffer
                                          );
                                          const v_2 = buffer
                                            .readFloatBE()
                                            .toFixed(1);

                                          client.readHoldingRegisters(
                                            ADDRESS_10,
                                            2,
                                            function (err, data) {
                                              if (err) {
                                                console.error(
                                                  `Error reading data v_3: ${err}`
                                                );
                                              } else {
                                                // Combine the two registers into a single 32-bit value
                                                const buffer = Buffer.from(
                                                  data.buffer
                                                );
                                                const v_3 = buffer
                                                  .readFloatBE()
                                                  .toFixed(1);
                                                client.readHoldingRegisters(
                                                  ADDRESS_4,
                                                  2,
                                                  function (err, data) {
                                                    if (err) {
                                                      console.error(
                                                        `Error reading data v_avg: ${err}`
                                                      );
                                                    } else {
                                                      // Combine the two registers into a single 32-bit value
                                                      const buffer =
                                                        Buffer.from(
                                                          data.buffer
                                                        );
                                                      const v_avg = buffer
                                                        .readFloatBE()
                                                        .toFixed(1);

                                                      insertValueIntoDatabase(
                                                        pool,
                                                        p_tot,
                                                        i_avg,
                                                        i_1,
                                                        i_2,
                                                        i_3,
                                                        v_1,
                                                        v_2,
                                                        v_3,
                                                        v_avg
                                                      );
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }, 60000);

    //Insert Data Perjam
    setInterval(() => {
      client.readHoldingRegisters(ADDRESS_3, 8, function (err, data) {
        if (err) {
          console.error(`Error reading data ptot: ${err}`);
        } else {
          // Combine the two registers into a single 32-bit value
          const buffer = Buffer.from(data.buffer);
          const highBits = buffer.readUInt32BE(0);
          const lowBits = buffer.readUInt32BE(4);
          const value = (BigInt(highBits) << BigInt(32)) + BigInt(lowBits); // Read UInt64 value

          updateValueInDatabase(pool, value, "e_del");
          const e_del = value;
          console.log(value);
          insertValueIntoDatabasePerjam(pool, e_del);
        }
      });
    }, 1800000);
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
