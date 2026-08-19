const Member = require("../models/Member");

/**
 * Retrieves member data for GDPR/CCPA compliance.
 * @param {string} memberId - The ID of the member.
 * @returns {Promise<object>} - A promise that resolves to the member's data.
 */
const getmemberData = async (memberId) => {
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error("member not found");
    }
    // Return a subset of data relevant for privacy requests, or all data if requested
    return member.toJSON();
  } catch (error) {
    console.error("Error retrieving member,
data:", error);
    throw error;
  }
};

/**
 * Rectifies (updates) member data.
 * @param {string} memberId - The ID of the member.
 * @param {object} updates - An object containing the fields to update.
 * @returns {Promise<object>} - A promise that resolves to the updated member data.
 */
const rectifymemberData = async (memberId, updates) => {
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error("member not found");
    }
    await member.update(updates);
    return member.toJSON();
  } catch (error) {
    console.error("Error rectifying member,
data:", error);
    throw error;
  }
};

/**
 * Deletes member data (right to be forgotten).
 * @param {string} memberId - The ID of the member.
 * @returns {Promise<void>} - A promise that resolves when the member data is deleted.
 */
const deletememberData = async (memberId) => {
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error("member not found");
    }
    await member.destroy();
  } catch (error) {
    console.error("Error deleting member,
data:", error);
    throw error;
  }
};

module.exports = { getmemberData, rectifymemberData, deletememberData };
