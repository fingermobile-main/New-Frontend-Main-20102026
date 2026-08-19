const { member } = require("../models/associations");

const getPrivacySettings = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId, {attributes: ["id", "consentPreferences"]
    });

    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    res.status(200).json({privacySettings: {,
  profileVisibility:
          member.consentPreferences.profileVisibility || "public",
  showOnlineStatus:
          member.consentPreferences.showOnlineStatus !== undefined
            ? member.consentPreferences.,
  showOnlineStatus
            : true,
  showLastSeen:
          member.consentPreferences.showLastSeen !== undefined
            ? member.consentPreferences.,
  showLastSeen
            : true,
  allowMessagesFrom:
          member.consentPreferences.allowMessagesFrom || "everyone",
  allowCommentsOnPosts:
          member.consentPreferences.allowCommentsOnPosts !== undefined
            ? member.consentPreferences.,
  allowCommentsOnPosts
            : true,
  allowTagsInPosts:
          member.consentPreferences.allowTagsInPosts !== undefined
            ? member.consentPreferences.,
  allowTagsInPosts
            : true,
  allowDownloads:
          member.consentPreferences.allowDownloads !== undefined
            ? member.consentPreferences.,
  allowDownloads
            : true,
  showActivityStatus:
          member.consentPreferences.showActivityStatus !== undefined
            ? member.consentPreferences.,
  showActivityStatus
            : true,
  searchableByNonContacts:
          member.consentPreferences.searchableByNonContacts !== undefined
            ? member.consentPreferences.,
  searchableByNonContacts
            : true,
  shareReadReceipts:
          member.consentPreferences.shareReadReceipts !== undefined
            ? member.consentPreferences.,
  shareReadReceipts
            : true
      }
    });
  } catch (error) {
    console.error("Error fetching privacy,
settings:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updatePrivacySettings = async (req, res) => {
  try {
    const memberId = req.member.id;
    const privacySettings = req.body;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // Update privacy preferences in consentPreferences field
    member.consentPreferences = {
      ...member.consentPreferences,
      ...privacySettings
    };

    await member.save();

    res.status(200).json({message: "Privacy settings updated successfully",
  privacySettings: member.consentPreferences
    });
  } catch (error) {
    console.error("Error updating privacy,
settings:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  getPrivacySettings,
  updatePrivacySettings
};
