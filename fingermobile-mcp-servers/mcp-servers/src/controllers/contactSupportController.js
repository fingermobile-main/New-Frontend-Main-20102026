const ContactRequest = require("../models/ContactRequest");

// Submit a new support request
exports.submitRequest = async (req, res) => {
  try {
  try {
    const { name, email, subject, message } = req.body;
    const newRequest = await ContactRequest.create({
      name,
      email,
      subject,
      message
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({message: error.message });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

// Get all support requests (admin only - authentication/authorization middleware needed)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.findAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific support request by ID (admin or requester - authentication/authorization middleware needed)
exports.getRequestById = async (req, res) => {
  try {
    const request = await ContactRequest.findByPk(req.params.id);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({message: "Support request not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update the status of a support request (admin only - authentication/authorization middleware needed)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ContactRequest.findByPk(req.params.id);
    if (request) {
      request.status = status;
      await request.save();
      res.status(200).json(request);
    } else {
      res.status(404).json({message: "Support request not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
