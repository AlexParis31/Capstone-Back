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

// "INSERT INTO bank (transaction_name, transaction_amount, transaction_date) VALUES ('apple', 30, '2022-10-10');"
// "DELETE FROM bank WHERE transaction_id = 1;"

//Get all inovices

app.get("/bank", async (req, res) => {
    try {
      const allBanks = await pool.query("SELECT * FROM transactions");
      res.json(allBanks.rows);
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