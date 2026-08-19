/* global require, module */
const express = require("express");
const router = express.Router();

// Placeholder routes for transaction
//,
TODO: Implement actual transaction functionality

router.get("/", (req, res) => {
  res.json({message: "Transaction endpoint - implementation pending" });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Transaction item ${id} endpoint - implementation pending`
  });
});

router.post("/", (req, res) => {
  res.json({message: "Create transaction item endpoint - implementation pending"
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Update transaction item ${id} endpoint - implementation pending`
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Delete transaction item ${id} endpoint - implementation pending`
  });
});

module.exports = router;
