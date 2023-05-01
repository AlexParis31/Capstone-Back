const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors())
app.use(express.json());


//ROUTES//

// register and login routes

app.use("/auth", require("./routes/jwtAuth"));

// dashboard route

app.use("/dashboard", require("./routes/dashboard"));


app.post("/banktwo", async (req, res) => {
  try {
    const newFunds = await pool.query(
      "CREATE TABLE transactionsTwo( transaction_id SERIAL PRIMARY KEY, name varchar(30), amount numeric(12,2), date varchar(30), category varchar(30))"
    );

    res.json(newFunds);
  } catch (err) {
    console.error(err.message);
  }
 
});


app.listen(3000, () => {
    console.log("server started");
});