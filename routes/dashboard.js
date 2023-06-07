const router = require("express").Router();
const pool = require("../db");
const authorization = require('../middleware/authorization')



//all banks and name
router.get("/", authorization, async (req, res) => {
    try {
        // const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [
        //     req.user.id
        // ]);

        const user = await pool.query("SELECT jusers.user_name, jbanks.bank_id, jbanks.name, jbanks.amount, jbanks.date, jbanks.category FROM jusers LEFT JOIN jbanks ON jusers.user_id = jbanks.user_id WHERE jusers.user_id = $1 ORDER BY date DESC",
        [req.user.id]
        );

        res.json(user.rows);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

//create jbank

router.post("/bank", authorization, async (req, res) => {
    try {
        console.log(req.body);
      const { name, amount, date, category } = req.body;
      const newBank = await pool.query(
        "INSERT INTO jbanks (user_id, name, amount, date, category) VALUES($1, $2, $3, $4, $5) RETURNING *",
        [req.user.id, name, amount, date, category]
      );
  
      res.json(newBank.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
   
  });

//update jbank

router.put("/bank/:id", authorization, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, amount, date, category } = req.body;
      const updateBank = await pool.query(
        "UPDATE jbanks SET name = $1, amount = $2, date = $3, category = $4 WHERE bank_id = $5 AND user_id = $6 RETURNING *",
        [name, amount, date, category, id, req.user.id]
      );

      if (updateBank.rows.length === 0) {
        return res.json("This account is not yours")
      }
  
      res.json("Bank was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });


//Delete bank

router.delete("/bank/:id", authorization, async (req, res) => {
    try {
      const { id } = req.params;
      const deleteBank = await pool.query("DELETE FROM jbanks WHERE bank_id = $1 AND user_id = $2 RETURNING *", [
        id, req.user.id
      ]);

      if (deleteBank.rows.length === 0) {
        res.json("This account is not yours")
      }

      res.json("Bank was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  });

// Get the sum of your expenses

router.get("/expenses", authorization, async (req, res) => {
    try {

        const user = await pool.query("SELECT SUM(jbanks.amount) AS sum FROM jusers LEFT JOIN jbanks ON jusers.user_id = jbanks.user_id WHERE jusers.user_id = $1",
        [req.user.id]
        );

        res.json({ funds: user.rows[0].sum });
        
    } catch (error) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

// router.get("/bgtsum", authorization, async (req, res) => {
//   try {
  
//       const user = await pool.query("SELECT SUM(jbgtex.amount) AS sum FROM jbudget LEFT JOIN jbgtex ON jbudget.user_id = jbgtex.user_id AND jbgtex.category = jbudget.category WHERE jbudget.user_id = $1 AND jbgtex.category = 'food'",
//       [req.user.id ]
//       );

//       res.json({ funds: user.rows[0].sum });
      
//   } catch (error) {
//       console.error(err.message);
//       res.status(500).json("server error");
//   }
// });

// Create a funds account

router.post("/fundscreate", authorization, async (req, res) => {
    try {
      const newBank = await pool.query(
        "INSERT INTO jfunds (user_id, funds) VALUES($1, 0) RETURNING *",
        [req.user.id]
      );
  
      res.json(newBank.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
   
  });

  // create a budget

  router.post("/budgetplan", authorization, async (req, res) => {
    try {
      const { category, budget } = req.body;
      const newBank = await pool.query(
        "INSERT INTO jbudget (user_id, category, budget) VALUES($1, $2, $3) RETURNING *",
        [req.user.id, category, budget]
      );
  
      res.json(newBank.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
   
  });

  router.get("/budgetplans", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT jbudget.budget_id, jbudget.category, jbudget.budget FROM jusers LEFT JOIN jbudget ON jusers.user_id = jbudget.user_id WHERE jusers.user_id = $1",
        [req.user.id]
        );

        res.json(user.rows);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

router.get("/bgtex", authorization, async (req, res) => {
  try {
      const user = await pool.query("SELECT jusers.user_name, jbgtex.bank_id, jbgtex.name, jbgtex.amount, jbgtex.date, jbgtex.category FROM jusers LEFT JOIN jbgtex ON jusers.user_id = jbgtex.user_id WHERE jusers.user_id = $1 ORDER BY date DESC",
      [req.user.id]
      );

      res.json(user.rows);
      
  } catch (error) {
      console.error(err.message);
      res.status(500).json("server error");
  }
});

router.post("/bgtex", authorization, async (req, res) => {
  try {
      console.log(req.body);
    const { name, amount, date, category } = req.body;
    const newBank = await pool.query(
      "INSERT INTO jbgtex (user_id, name, amount, date, category) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, name, amount, date, category]
    );

    res.json(newBank.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
 
});

router.get("/bgtsum", authorization, async (req, res) => {
  try {
      const user = await pool.query("SELECT category, SUM(amount) AS total_amount FROM jbgtex WHERE user_id = $1 GROUP BY category;",
      [req.user.id]
      );

      res.json(user.rows);
      
  } catch (error) {
      console.error(err.message);
      res.status(500).json("server error");
  }
});


// Get the amount of funds in your account

router.get("/funds", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT jusers.user_name, jfunds.fund_id, jfunds.funds FROM jusers LEFT JOIN jfunds ON jusers.user_id = jfunds.user_id WHERE jusers.user_id = $1",
        [req.user.id]
        );

        res.json(user.rows[0]);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

// Add funds to your account

router.put("/fundscreate/:id", authorization, async (req, res) => {
    try {
      const { funds } = req.body;
      const updateBank = await pool.query(
        "UPDATE jfunds SET funds = funds + $1 WHERE user_id = $2 RETURNING *",
        [funds, req.user.id]
      );

      if (updateBank.rows.length === 0) {
        return res.json("This account is not yours")
      }
  
      res.json("Bank was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });


module.exports = router;