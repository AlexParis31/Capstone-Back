const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors())
app.use(express.json());


//ROUTES//

//Create Invoice

app.post("/bank", async (req, res) => {
  try {
    const { name, amount, date } = req.body;
    const newBank = await pool.query(
      "INSERT INTO transactions (name, amount, date) VALUES($1, $2, $3) RETURNING *",
      [name, amount, date]
    );

    res.json(newBank.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
 
});

app.post("/myfunds", async (req, res) => {
  try {
    const { funds } = req.body;
    const newFunds = await pool.query(
      "UPDATE myfunds SET funds = funds + $1 WHERE transaction_id = 1",
      [funds]
    );

    res.json(newFunds.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
 
});



app.get("/bank", async (req, res) => {
    try {
      const allBanks = await pool.query("SELECT * FROM transactions ORDER BY date DESC");
      const sumFunds = await pool.query("SELECT SUM (amount) FROM transactions");
      res.json({
        allBanks: allBanks.rows,
        sumFunds: sumFunds.rows[0].sum
      });
    } catch (err) {
      console.error(err.message);
    }
  });

app.get("/myfunds", async (req, res) => {
    try {
      const allFunds = await pool.query("SELECT * FROM myfunds WHERE transaction_id = 1");
      res.json(allFunds.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  

//Get a invoice

app.get("/bank/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await pool.query("SELECT * FROM transactions WHERE transaction_id = $1", [
        id
      ]);
  
      res.json(bank.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

//Update a invoice

app.put("/bank/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, amount, date } = req.body;
      const updateBank = await pool.query(
        "UPDATE transactions SET name = $1, amount = $2, date = $3 WHERE transaction_id = $4",
        [name, amount, date, id]
      );
  
      res.json("Bank was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });

//Delete a invoice

app.delete("/bank/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteBank = await pool.query("DELETE FROM transactions WHERE transaction_id = $1", [
        id
      ]);
      res.json("Bank was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  });


app.listen(3000, () => {
    console.log("server started");
});