const jwt = require("jsonwebtoken");
const { Member } = require("../models/associations"); // Assuming you have a Member model

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, member) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    // Fetch the member from the database to ensure they still exist and are active
    const foundMember = await Member.findByPk(member.id);
    if (!foundMember) {
      return res.sendStatus(403); // Member not found or inactive
    }
    req.member = foundMember; // Attach the member object to the request
    req.member.role = foundMember.role; // Explicitly attach the role
    next();
  });
};

module.exports = { authenticateToken };
