/* global require, module */
const express = require("express");
const router = express.Router();

// Placeholder routes for product
//,
TODO: Implement actual product functionality

router.get("/", (req, res) => {
  res.json({message: "Product endpoint - implementation pending" });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Product item ${id} endpoint - implementation pending` });
});

router.post("/", (req, res) => {
  res.json({message: "Create product item endpoint - implementation pending"
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Update product item ${id} endpoint - implementation pending`
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Delete product item ${id} endpoint - implementation pending`
  });
});

module.exports = router;
