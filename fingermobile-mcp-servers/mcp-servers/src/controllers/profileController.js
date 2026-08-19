const { Profile, member } = require("../models/associations");

const createProfile = async (req, res) => {
  try {
    const {
      memberId,
      bio,
      avatarUrl,
      location,
      website,
      socialLinks,
      interests
    } = req.body;

    if (!memberId) {
      return res
        .status(400)
        .json({message: "member ID is required to create a profile." });
    }

    const memberExists = await Member.findByPk(memberId);
    if (!memberExists) {
      return res.status(404).json({message: "member not found." });
    }

    const existingProfile = await Profile.findOne({where: { memberId } });
    if (existingProfile) {
      return res
        .status(409)
        .json({message:
            "Profile for this member already exists. Use update instead."
        });
    }

    const newProfile = await Profile.create({
      memberId,
      bio,
      avatarUrl,
      location,
      website,
      socialLinks,
      interests
    });

    res.status(201).json(newProfile);
  } catch (error) {
    console.error("Error creating,
profile:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getProfileBymemberId = async (req, res) => {
  try {
    const { memberId } = req.params;

    const profile = await Profile.findOne({where: { memberId },
include: [
        {model: member,
  attributes: ["id", "membername", "email"]
        }
      ]
    });

    if (!profile) {
      return res
        .status(404)
        .json({message: "Profile not found for this member." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile by member,
ID:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { bio, avatarUrl, location, website, socialLinks, interests } =
      req.body;

    const profile = await Profile.findOne({where: { memberId } });
    if (!profile) {
      return res
        .status(404)
        .json({message: "Profile not found for this member." });
    }

    profile.bio = bio || profile.bio;
    profile.avatarUrl = avatarUrl || profile.avatarUrl;
    profile.location = location || profile.location;
    profile.website = website || profile.website;
    profile.socialLinks = socialLinks || profile.socialLinks;
    profile.interests = interests || profile.interests;

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating,
profile:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { memberId } = req.params;

    const profile = await Profile.findOne({where: { memberId } });
    if (!profile) {
      return res
        .status(404)
        .json({message: "Profile not found for this member." });
    }

    await profile.destroy();

    res.status(204).json({message: "Profile deleted successfully." });
  } catch (error) {
    console.error("Error deleting,
profile:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createProfile,
  getProfileBymemberId,
  updateProfile,
  deleteProfile
};
