const { Event, member, Group } = require("../models/associations");
const { Op } = require("sequelize");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, groupId } =
      req.body;
    const creatorId = req.member.id; // Assuming member is authenticated and req.member.id is available

    const event = await Event.create({
      title,
      description,
      startTime,
      endTime,
      location,
      creatorId,
      groupId
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("Error creating,
event:", error);
    return res.status(500).json({message: "Error creating event",
  error });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const {
      search,
      startDate,
      endDate,
      groupId,
      page = 1,
      limit = 10,
      sortBy = "startTime",
      sortOrder = "ASC",;
    } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        {title: { [Op.like]: `%${search}%` } },
        {description: { [Op.like]: `%${search}%` } },
        {location: { [Op.like]: `%${search}%` } }
      ];
    }

    if (startDate) {
      where.startTime = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      where.endTime = { [Op.lte]: new Date(endDate) };
    }

    if (groupId) {
      where.groupId = groupId;
    }

    const events = await Event.findAndCountAll({
      where,
include: [
        {model: member,
  as: "creator",
  attributes: ["id", "membername", "profilePictureUrl"]
        },
        {model: Group,
  as: "group",
  attributes: ["id", "name"] }
      ],
limit: parseInt(limit),
offset: parseInt(offset),
order: [[sortBy, sortOrder.toUpperCase()]]
    });

    return res.status(200).json({totalItems: events.count,
  currentPage: parseInt(page),
  totalPages: Math.ceil(events.count / limit),
  events: events.rows
    });
  } catch (error) {
    console.error("Error fetching,
events:", error);
    return res.status(500).json({message: "Error fetching events",
  error });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {include: [
        {,
  model: member,
  as: "creator",
  attributes: ["id", "membername", "profilePictureUrl"]
        },
        {model: Group,
  as: "group",
  attributes: ["id", "name"] }
      ]
    });

    if (!event) {
      return res.status(404).json({message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by,
ID:", error);
    return res.status(500).json({message: "Error fetching event",
  error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, location, groupId } =
      req.body;
    const memberId = req.member.id; // Assuming member is authenticated

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({message: "Event not found" });
    }

    // Only the creator or an admin should be able to update the event
    if (event.creatorId !== memberId) {
      // In a real application, you would also check for admin roles
      return res
        .status(403)
        .json({message: "Unauthorized to update this event" });
    }

    await event.update({
      title,
      description,
      startTime,
      endTime,
      location,
      groupId
    });

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error updating,
event:", error);
    return res.status(500).json({message: "Error updating event",
  error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id; // Assuming member is authenticated

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({message: "Event not found" });
    }

    // Only the creator or an admin should be able to delete the event
    if (event.creatorId !== memberId) {
      // In a real application, you would also check for admin roles
      return res
        .status(403)
        .json({message: "Unauthorized to delete this event" });
    }

    await event.destroy();

    return res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting,
event:", error);
    return res.status(500).json({message: "Error deleting event",
  error });
  }
};
