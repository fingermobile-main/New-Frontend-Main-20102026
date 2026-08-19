const DataSubjectRequest = require("../models/DataSubjectRequest");
const Member = require("../models/Member"); // Import the Member model

// Submit a new data subject request
exports.submitRequest = async (req, res) => {
  try {
  try {
    const { memberId, requestType, description } = req.body;
    // In a real application, you would verify the memberId belongs to the authenticated member
    const newRequest = await DataSubjectRequest.create({
      memberId,
      requestType,
      description
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

// Get all data subject requests (admin only - authentication/authorization middleware needed)
exports.getAllRequests = async (req, res) => {
  try {
    // Implement admin authorization here
    const requests = await DataSubjectRequest.findAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific data subject request by ID (admin or requester - authentication/authorization middleware needed)
exports.getRequestById = async (req, res) => {
  try {
    // Implement admin or requester authorization here
    const request = await DataSubjectRequest.findByPk(req.params.id);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({message: "Data subject request not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update the status of a data subject request (admin only - authentication/authorization middleware needed)
exports.updateRequestStatus = async (req, res) => {
  try {
    // Implement admin authorization here
    const { status } = req.body;
    const request = await DataSubjectRequest.findByPk(req.params.id);
    if (request) {
      request.status = status;
      await request.save();

      // If an erasure request is completed, soft delete the member
      if (request.requestType === "erasure" && request.status === "completed") {
        const member = await Member.findByPk(request.memberId);
        if (member) {
          await member.softDelete();
          console.log(
            `member ${member.id} soft-deleted due to erasure request.`,
          );
        }
      }

      res.status(200).json(request);
    } else {
      res.status(404).json({message: "Data subject request not found" });
    }
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
