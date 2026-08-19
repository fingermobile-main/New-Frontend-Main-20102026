const {
  DeveloperApplication,
  Member,
  ApiKey,
  WebhookEndpoint,
  ApiRateLimit
} = require("../models/associations");

const createApplication = async (req, res) => {
  try {
    const { name, description } = req.body;
    const memberId = req.member.id; // Assuming authenticateToken middleware attaches member info to handle

    if (!name || !description) {
      return res
        .status(400)
        .json({message: "Application name and description are required." });
    }

    // Generate a simple API key prefix for now, can be made more robust later
    const apiKeyPrefix =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const application = await DeveloperApplication.create({
      memberId,
      name,
      description,
      apiKeyPrefix
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error creating,
application:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApplications = async (req, res) => {
  try {
    const memberId = req.member.id; // Assuming authenticateToken middleware attaches member info to handle

    const applications = await DeveloperApplication.findAll({where: { memberId },
include: [{model: Member,
  attributes: ["membername", "email"] }]
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching,
applications:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const application = await DeveloperApplication.findOne({where: { id,
  memberId },
include: [{model: Member,
  attributes: ["membername", "email"] }]
    });

    if (!application) {
      return res.status(404).json({message: "Application not found." });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application by,
ID:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;
    const { name, description } = req.body;

    const application = await DeveloperApplication.findOne({where: { id,
  memberId }
    });

    if (!application) {
      return res.status(404).json({message: "Application not found." });
    }

    application.name = name || application.name;
    application.description = description || application.description;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating,
application:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const application = await DeveloperApplication.findOne({where: { id,
  memberId }
    });

    if (!application) {
      return res.status(404).json({message: "Application not found." });
    }

    await application.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting,
application:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const createApiKey = async (req, res) => {
  try {
    const { applicationId, name } = req.body;
    const memberId = req.member.id;

    if (!applicationId || !name) {
      return res
        .status(400)
        .json({message: "Application ID and API Key name are required." });
    }

    const application = await DeveloperApplication.findOne({where: {,
  id: applicationId,
  memberId }
    });

    if (!application) {
      return res
        .status(404)
        .json({message: "Application not found or does not belong to you." });
    }

    // Generate a unique API key
    const apiKey = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const newApiKey = await ApiKey.create({
      applicationId,
      name,
key: apiKey,
      // You might want to add an expiration date or other metadata here
    });

    res.status(201).json(newApiKey);
  } catch (error) {
    console.error("Error creating API,
key:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApiKeys = async (req, res) => {
  try {
    const memberId = req.member.id;

    const apiKeys = await ApiKey.findAll({include: [
        {,
  model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    res.status(200).json(apiKeys);
  } catch (error) {
    console.error("Error fetching API,
keys:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApiKeyById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const apiKey = await ApiKey.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    if (!apiKey) {
      return res
        .status(404)
        .json({message: "API Key not found or does not belong to your applications."
        });
    }

    res.status(200).json(apiKey);
  } catch (error) {
    console.error("Error fetching API key by,
ID:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const apiKey = await ApiKey.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId }
        }
      ]
    });

    if (!apiKey) {
      return res
        .status(404)
        .json({message: "API Key not found or does not belong to your applications."
        });
    }

    await apiKey.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting API,
key:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const createWebhookEndpoint = async (req, res) => {
  try {
    const { applicationId, url, events } = req.body;
    const memberId = req.member.id;

    if (
      !applicationId ||
      !url ||
      !events ||
      !Array.isArray(events) ||
      events.length === 0
    ) {
      return res
        .status(400)
        .json({message: "Application ID,
  URL,
  and at least one event are required."
        });
    }

    const application = await DeveloperApplication.findOne({where: {,
  id: applicationId,
  memberId }
    });

    if (!application) {
      return res
        .status(404)
        .json({message: "Application not found or does not belong to you." });
    }

    const webhookEndpoint = await WebhookEndpoint.create({
      applicationId,
      url,
      events,
secret: Math.random().toString(36).substring(2, 15), // Simple secret generation
    });

    res.status(201).json(webhookEndpoint);
  } catch (error) {
    console.error("Error creating webhook,
endpoint:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getWebhookEndpoints = async (req, res) => {
  try {
    const memberId = req.member.id;

    const webhookEndpoints = await WebhookEndpoint.findAll({include: [
        {,
  model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    res.status(200).json(webhookEndpoints);
  } catch (error) {
    console.error("Error fetching webhook,
endpoints:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getWebhookEndpointById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const webhookEndpoint = await WebhookEndpoint.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    if (!webhookEndpoint) {
      return res
        .status(404)
        .json({message:
            "Webhook endpoint not found or does not belong to your applications."
        });
    }

    res.status(200).json(webhookEndpoint);
  } catch (error) {
    console.error("Error fetching webhook endpoint by,
ID:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const updateWebhookEndpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;
    const { url, events } = req.body;

    const webhookEndpoint = await WebhookEndpoint.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId }
        }
      ]
    });

    if (!webhookEndpoint) {
      return res
        .status(404)
        .json({message:
            "Webhook endpoint not found or does not belong to your applications."
        });
    }

    webhookEndpoint.url = url || webhookEndpoint.url;
    webhookEndpoint.events = events || webhookEndpoint.events;
    await webhookEndpoint.save();

    res.status(200).json(webhookEndpoint);
  } catch (error) {
    console.error("Error updating webhook,
endpoint:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const deleteWebhookEndpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const webhookEndpoint = await WebhookEndpoint.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId }
        }
      ]
    });

    if (!webhookEndpoint) {
      return res
        .status(404)
        .json({message:
            "Webhook endpoint not found or does not belong to your applications."
        });
    }

    await webhookEndpoint.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting webhook,
endpoint:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const createApiRateLimit = async (req, res) => {
  try {
    const { applicationId, period, limit, burst } = req.body;
    const memberId = req.member.id;

    if (!applicationId || !period || !limit || !burst) {
      return res
        .status(400)
        .json({message: "Application ID,
  period,
  limit,
  and burst are required."
        });
    }

    const application = await DeveloperApplication.findOne({where: {,
  id: applicationId,
  memberId }
    });

    if (!application) {
      return res
        .status(404)
        .json({message: "Application not found or does not belong to you." });
    }

    const apiRateLimit = await ApiRateLimit.create({
      applicationId,
      period,
      limit,
      burst
    });

    res.status(201).json(apiRateLimit);
  } catch (error) {
    console.error("Error creating API rate,
limit:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApiRateLimits = async (req, res) => {
  try {
    const memberId = req.member.id;

    const apiRateLimits = await ApiRateLimit.findAll({include: [
        {,
  model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    res.status(200).json(apiRateLimits);
  } catch (error) {
    console.error("Error fetching API rate,
limits:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const getApiRateLimitById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const apiRateLimit = await ApiRateLimit.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId },
attributes: ["name", "description"]
        }
      ]
    });

    if (!apiRateLimit) {
      return res
        .status(404)
        .json({message:
            "API rate limit not found or does not belong to your applications."
        });
    }

    res.status(200).json(apiRateLimit);
  } catch (error) {
    console.error("Error fetching API rate limit by,
ID:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const updateApiRateLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;
    const { period, limit, burst } = req.body;

    const apiRateLimit = await ApiRateLimit.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId }
        }
      ]
    });

    if (!apiRateLimit) {
      return res
        .status(404)
        .json({message:
            "API rate limit not found or does not belong to your applications."
        });
    }

    apiRateLimit.period = period || apiRateLimit.period;
    apiRateLimit.limit = limit || apiRateLimit.limit;
    apiRateLimit.burst = burst || apiRateLimit.burst;
    await apiRateLimit.save();

    res.status(200).json(apiRateLimit);
  } catch (error) {
    console.error("Error updating API rate,
limit:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

const deleteApiRateLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    const apiRateLimit = await ApiRateLimit.findOne({where: { id },
include: [
        {model: DeveloperApplication,
  where: { memberId }
        }
      ]
    });

    if (!apiRateLimit) {
      return res
        .status(404)
        .json({message:
            "API rate limit not found or does not belong to your applications."
        });
    }

    await apiRateLimit.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting API rate,
limit:", error);
    res.status(500).json({message: "Internal server error." });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  createApiKey,
  getApiKeys,
  getApiKeyById,
  deleteApiKey,
  createWebhookEndpoint,
  getWebhookEndpoints,
  getWebhookEndpointById,
  updateWebhookEndpoint,
  deleteWebhookEndpoint,
  createApiRateLimit,
  getApiRateLimits,
  getApiRateLimitById,
  updateApiRateLimit,
  deleteApiRateLimit
};
