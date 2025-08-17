const mysql = require("mysql");
require("dotenv").config();

// Create connection pool (better performance than single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "user_service",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10, // Maximum number of connections
  queueLimit: 0, // Unlimited queued connections
});

// Verify connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    process.exit(1); // Exit if can't connect
  }

  console.log("Connected to MySQL database!");
  connection.release(); // Release the connection back to the pool
});

// Promisify for async/await support
pool.promiseQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = pool;
