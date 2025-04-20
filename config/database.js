require("dotenv").config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);


const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
const path = require("path");

const connectionConf = {
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
};

// Certificado de la autoridad certificadora (CA)
if (process.env.MODE === "prod" || process.env.MODE === "test") connectionConf.ssl = { ca: fs.readFileSync(path.join(__dirname, "certificates/DigiCertGlobalRootCA.crt.pem")) };


const pool = mysql.createPool(connectionConf);

pool.query = util.promisify(pool.query);
pool.end = util.promisify(pool.end);

module.exports = pool;
