javascript
const express = require("express");
const sql = require("mssql");
const app = express();
// SQL Server configuration
var config = {
 "user": "postgres", // Database username
 "password": "BuCerATlalpan", // Database password
 "server": "Databases", // Server IP address
 "database": "Atlas_Tlalpan", // Database name
 "options": {
 "encrypt": false // Disable encryption
 }
}
// Connect to SQL Server
sql.connect(config, err => {
 if (err) {
 throw err;
 }
 console.log("Connection Successful!");
});
// Define route for fetching data from SQL Server
app.get("/Vialidades_primarias_tlalpan — cortado", (request, response) => {
 // Execute a SELECT query
 new sql.Request().query("SELECT * FROM Employee", (err, result) => {
 if (err) {
 console.error("Error executing query:", err);
 } else {
 response.send(result.recordset); // Send query result as response
 console.dir(result.recordset);
 }
 });
});
// Start the server on port 3000
app.listen(3000, () => {
 console.log("Listening on port 3000…");
})