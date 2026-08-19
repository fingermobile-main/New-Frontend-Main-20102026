/* global require, module */
const express = require("express");
const router = express.Router();

// Placeholder routes for livestreams
//,
TODO: Implement actual livestream functionality

router.get("/", (req, res) => {
  res.json({message: "Livestreams endpoint - implementation pending" });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Livestream ${id} endpoint - implementation pending` });
});

router.post("/", (req, res) => {
  res.json({message: "Create livestream endpoint - implementation pending" });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Update livestream ${id} endpoint - implementation pending`
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.json({message: `Delete livestream ${id} endpoint - implementation pending`
  });
});

module.exports = router;
