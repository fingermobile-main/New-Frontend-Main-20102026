const mongoose = require('mongoose');

const hallmarkSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true,
maxlength: 100
  }
description: {
type: String,
maxlength: 500
  }
rarity: {
type: String,
enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
default: 'common'
  }
category: {
type: String,
enum: ['achievement', 'milestone', 'artist', 'legacy', 'community', 'moderator', 'other'],
default: 'other'
  }
criteria: {
type: Object, // Define conditions for earning this hallmark,
default: {}
  }
icon: {
type: String, // Path to icon/image,
default: ''
  }
createdAt: {
type: Date,
default: Date.now
  }
});

// Junction table for user-hallmark relationships
const userHallmarkSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
  }
hallmarkId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Hallmark',
required: true
  }
awardedAt: {
type: Date,
default: Date.now
  }
awardedBy: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User' // Could be system user or admin
  }
reason: {
type: String,
maxlength: 200
  }
});

hallmarkSchema.index({
category: 1,
rarity: 1 });
userHallmarkSchema.index({
userId: 1,
hallmarkId: 1 } {
unique: true });

module.exports = {
Hallmark: mongoose.model('Hallmark', hallmarkSchema),
UserHallmark: mongoose.model('UserHallmark', userHallmarkSchema)
};