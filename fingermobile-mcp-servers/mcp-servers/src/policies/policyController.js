const Policy = require("../models/Policy");

exports.createPolicy = async (req, res) => {
  try {
  try {
    const { name, description, rules } = req.body;
    const newPolicy = await Policy.create({ name, description, rules });
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({error: error.message });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.findAll();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByPk(id);
    if (policy) {
      res.status(200).json(policy);
    } else {
      res.status(404).json({message: "Policy not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rules } = req.body;
    const [updated] = await Policy.update(
      { name, description, rules },
      {where: { id }
      },
    );
    if (updated) {
      const updatedPolicy = await Policy.findByPk(id);
      res.status(200).json(updatedPolicy);
    } else {
      res.status(404).json({message: "Policy not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Policy.destroy({where: { id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({message: "Policy not found" });
    }
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};
